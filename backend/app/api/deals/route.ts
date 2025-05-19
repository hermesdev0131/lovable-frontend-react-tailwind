import { NextRequest, NextResponse } from 'next/server';
import { corsOptionsResponse, corsHeaders } from '@/lib/cors';
import { createDeal, updateDeal, deleteDeal } from '@/lib/hubspot';

const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

// Custom properties to ensure in HubSpot for deals
const customDealProperties = [
  {
    name: 'deal_probability',
    label: 'Deal Probability',
    description: 'Probability of closing the deal (0-100)',
    type: 'number',
    fieldType: 'number',
  },
  {
    name: 'deal_description',
    label: 'Deal Description',
    description: 'Detailed description of the deal',
    type: 'string',
    fieldType: 'textarea',
  },
  {
    name: 'custom_fields',
    label: 'Custom Fields',
    description: 'JSON string of custom fields for the deal',
    type: 'string',
    fieldType: 'textarea',
  },
];

// Ensure custom deal properties exist
async function ensureCustomDealPropertiesExist(accessToken: string) {
  for (const property of customDealProperties) {
    try {
      const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/properties/deals/${property.name}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 404) {
        console.log(`Creating deal property: ${property.name}`);
        await fetch(`${HUBSPOT_BASE_URL}/crm/v3/properties/deals`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: property.name,
            label: property.label,
            description: property.description,
            groupName: 'dealinformation',
            type: property.type,
            fieldType: property.fieldType,
          }),
        });
      }
    } catch (error) {
      console.error(`Error ensuring deal property ${property.name}:`, error);
    }
  }
}

// Map our deal stages to HubSpot deal stages
const stageMapping: Record<string, string> = {
  'discovery': 'appointmentscheduled',
  'proposal': 'qualifiedtobuy',
  'negotiation': 'presentationscheduled',
  'closed_won': 'closedwon',
  'closed_lost': 'closedlost',
};

// Reverse mapping for getting our stage from HubSpot stage
const reverseStageMapping: Record<string, string> = Object.entries(stageMapping).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }), {}
);

// Convert our deal object to HubSpot properties
function dealToHubspotProperties(dealData: any) {
  const properties: Record<string, any> = {
    dealname: dealData.name,
    amount: dealData.value?.toString() || '0',
    dealstage: stageMapping[dealData.stage] || 'appointmentscheduled',
    pipeline: 'default',
    deal_probability: dealData.probability?.toString() || '0',
    deal_description: dealData.description || '',
    closedate: dealData.closingDate ? new Date(dealData.closingDate).getTime().toString() : new Date().getTime().toString(),
  };

  // Add company name if available
  if (dealData.company) {
    properties.company = dealData.company;
  }

  // Add custom fields as JSON string if available
  if (dealData.customFields) {
    properties.custom_fields = JSON.stringify(dealData.customFields);
  }

  return properties;
}

// Convert HubSpot deal to our deal object
function hubspotToDeal(hubspotDeal: any) {
  const props = hubspotDeal.properties;
  
  return {
    id: hubspotDeal.id,
    hubspotId: hubspotDeal.id,
    name: props.dealname || '',
    company: props.company || '',
    value: parseFloat(props.amount) || 0,
    currency: 'USD', // Default to USD, HubSpot doesn't store currency per deal
    probability: parseInt(props.deal_probability) || 0,
    stage: reverseStageMapping[props.dealstage] || 'discovery',
    closingDate: props.closedate ? new Date(parseInt(props.closedate)).toISOString() : new Date().toISOString(),
    description: props.deal_description || '',
    createdAt: props.createdate ? new Date(parseInt(props.createdate)).toISOString() : new Date().toISOString(),
    updatedAt: props.hs_lastmodifieddate ? new Date(parseInt(props.hs_lastmodifieddate)).toISOString() : new Date().toISOString(),
    customFields: props.custom_fields ? JSON.parse(props.custom_fields) : {},
  };
}

// Handle CORS preflight
export async function OPTIONS() {
  return corsOptionsResponse();
}

// POST: Create a new deal
export async function POST(request: NextRequest) {
  try {
    const dealData = await request.json();

    if (!dealData.name) {
      return corsHeaders(NextResponse.json({ message: 'Deal name is required' }, { status: 400 }));
    }

    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN!;
    await ensureCustomDealPropertiesExist(accessToken);

    const properties = dealToHubspotProperties(dealData);

    try {
      // Use the hubspot library function to create the deal
      const hubspotDeal = await createDeal(properties);
      
      // Convert the HubSpot deal to our deal format
      const deal = hubspotToDeal(hubspotDeal);
      
      return corsHeaders(
        NextResponse.json({
          ...deal,
          message: 'Deal created successfully in HubSpot',
        })
      );
    } catch (error: any) {
      console.error('Error creating deal with HubSpot client:', error);
      
      // Fallback to direct API call if the client fails
      const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create deal');

      // Convert the HubSpot response to our deal format
      const deal = {
        id: data.id,
        hubspotId: data.id,
        ...dealData,
      };

      return corsHeaders(
        NextResponse.json({
          ...deal,
          message: 'Deal created successfully in HubSpot',
        })
      );
    }
  } catch (error: any) {
    console.error('HubSpot Deal Creation Error:', error);
    return corsHeaders(
      NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
    );
  }
}

// GET: Fetch deals
export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN!;
    await ensureCustomDealPropertiesExist(accessToken);

    // Check if we're looking for a specific deal by ID
    const url = new URL(request.url);
    const dealId = url.searchParams.get('id');

    if (dealId) {
      // Fetch a single deal by ID
      const fields = [
        'dealname',
        'amount',
        'dealstage',
        'pipeline',
        'closedate',
        'createdate',
        'hs_lastmodifieddate',
        'company',
        'deal_probability',
        'deal_description',
        'custom_fields',
      ].join(',');

      const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${dealId}?properties=${fields}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 404) {
        return corsHeaders(NextResponse.json({ message: 'Deal not found' }, { status: 404 }));
      }

      const deal = await res.json();
      if (!res.ok) throw new Error(deal.message || 'Failed to fetch deal');

      // Convert the HubSpot deal to our deal format
      const formattedDeal = hubspotToDeal(deal);

      return corsHeaders(NextResponse.json(formattedDeal));
    } else {
      // Fetch all deals
      const fields = [
        'dealname',
        'amount',
        'dealstage',
        'pipeline',
        'closedate',
        'createdate',
        'hs_lastmodifieddate',
        'company',
        'deal_probability',
        'deal_description',
        'custom_fields',
      ].join(',');

      const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals?limit=100&properties=${fields}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch deals');

      // Convert all HubSpot deals to our deal format
      const deals = data.results.map((deal: any) => hubspotToDeal(deal));

      return corsHeaders(NextResponse.json(deals));
    }
  } catch (error: any) {
    console.error('HubSpot Deal Fetch Error:', error);
    return corsHeaders(
      NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
    );
  }
}

// PUT: Update a deal by ID
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    
    // Extract deal ID and check if this is a stage update
    let dealId;
    let isStageUpdate = false;
    
    // Check URL pattern: /api/deals/{id}/stage
    if (pathParts.length >= 5 && pathParts[pathParts.length - 1] === 'stage') {
      dealId = pathParts[pathParts.length - 2];
      isStageUpdate = true;
    } 
    // Check URL pattern: /api/deals/{id}
    else if (pathParts.length >= 4) {
      dealId = pathParts[pathParts.length - 1];
    }
    
    if (!dealId || dealId === 'deals') {
      return corsHeaders(NextResponse.json({ message: 'Deal ID is required' }, { status: 400 }));
    }

    const dealData = await request.json();
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN!;
    
    if (isStageUpdate) {
      // This is a stage update request
      const { stage, stageName } = dealData;
      
      if (!stage) {
        return corsHeaders(NextResponse.json({ message: 'Stage is required' }, { status: 400 }));
      }
      
      const properties = {
        dealstage: stageMapping[stage] || 'appointmentscheduled',
      };
      
      try {
        // Use the hubspot library function to update the deal
        const hubspotDeal = await updateDeal(dealId, properties);
        
        return corsHeaders(
          NextResponse.json({
            id: dealId,
            stage,
            stageName,
            message: 'Deal stage updated successfully in HubSpot',
          })
        );
      } catch (error: any) {
        console.error('Error updating deal stage with HubSpot client:', error);
        
        // Fallback to direct API call if the client fails
        const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${dealId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        });

        if (res.status === 404) {
          return corsHeaders(NextResponse.json({ message: 'Deal not found' }, { status: 404 }));
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update deal stage');
        }

        return corsHeaders(
          NextResponse.json({
            id: dealId,
            stage,
            stageName,
            message: 'Deal stage updated successfully in HubSpot',
          })
        );
      }
    } else {
      // This is a full deal update request
      if (!dealData.name) {
        return corsHeaders(NextResponse.json({ message: 'Deal name is required' }, { status: 400 }));
      }
      
      const properties = dealToHubspotProperties(dealData);
      
      try {
        // Use the hubspot library function to update the deal
        const hubspotDeal = await updateDeal(dealId, properties);
        
        // Convert the HubSpot deal to our deal format
        const deal = hubspotToDeal(hubspotDeal);
        
        return corsHeaders(
          NextResponse.json({
            ...deal,
            message: 'Deal updated successfully in HubSpot',
          })
        );
      } catch (error: any) {
        console.error('Error updating deal with HubSpot client:', error);
        
        // Fallback to direct API call if the client fails
        const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${dealId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        });

        if (res.status === 404) {
          return corsHeaders(NextResponse.json({ message: 'Deal not found' }, { status: 404 }));
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update deal');
        }

        // Get the updated deal
        const getRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${dealId}?properties=dealname,amount,dealstage,closedate,hs_lastmodifieddate`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const updatedDeal = await getRes.json();
        
        // Convert to our format and return
        const deal = {
          id: dealId,
          hubspotId: dealId,
          ...dealData,
          updatedAt: new Date().toISOString(),
        };

        return corsHeaders(
          NextResponse.json({
            ...deal,
            message: 'Deal updated successfully in HubSpot',
          })
        );
      }
    }
  } catch (error: any) {
    console.error('HubSpot Deal Update Error:', error);
    return corsHeaders(
      NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
    );
  }
}

// DELETE: Delete a deal by ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    
    // Extract deal ID from URL pattern: /api/deals/{id}
    let dealId;
    if (pathParts.length >= 4) {
      dealId = pathParts[pathParts.length - 1];
    }
    
    if (!dealId || dealId === 'deals') {
      return corsHeaders(NextResponse.json({ message: 'Deal ID is required' }, { status: 400 }));
    }

    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN!;
    if (!accessToken) {
      console.error("No HubSpot access token found");
      return corsHeaders(NextResponse.json({ message: 'Server configuration error' }, { status: 500 }));
    }
    
    console.log(`Attempting to delete deal with ID: ${dealId}`);
    
    try {
      // Use the hubspot library function to delete the deal
      await deleteDeal(dealId);
      
      return corsHeaders(
        NextResponse.json({
          message: 'Deal deleted successfully from HubSpot',
          id: dealId
        })
      );
    } catch (error: any) {
      console.error('Error deleting deal with HubSpot client:', error);
      
      // Fallback to direct API call if the client fails
      const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${dealId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 404) {
        return corsHeaders(NextResponse.json({ message: 'Deal not found' }, { status: 404 }));
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete deal');
      }

      return corsHeaders(
        NextResponse.json({
          message: 'Deal deleted successfully from HubSpot',
          id: dealId
        })
      );
    }
  } catch (error: any) {
    console.error('HubSpot Deal Deletion Error:', error);
    return corsHeaders(
      NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
    );
  }
}
