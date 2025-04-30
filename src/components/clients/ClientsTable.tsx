
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, setDate } from 'date-fns';
import { DateRange } from 'react-day-picker';

const ClientsTable = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedLeadType, setSelectedLeadType] = useState<string>('all');
	const [selectedLeadSource, setSelectedLeadSource] = useState<string>('all');
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [showFilters, setShowFilters] = useState(false);
	const [sortField, setSortField] = useState<keyof typeof clientsWithTags[0] | null>(null);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const navigate = useNavigate();
	const { clients } = useMasterAccount();
	// Collect all unique tags from clients - protect against undefined tags
	const allTags = Array.from(
		new Set(
			clients.flatMap(client => client.tags || [])
		)
	);

	// Collect all unique Lead types and sources
	const leadTypes = Array.from(new Set(clients.map(client => client.leadType || '')));
	const leadSources = Array.from(new Set(clients.map(client => client.leadSource || '')));

	// Map clients to format needed by the table
	const clientsWithTags = clients.map(client => ({
		id: client.id.toString(),
		name: `${client.firstName} ${client.lastName}`,
		email: client.emails && client.emails.length > 0 ? client.emails[0] : '',
		company: client.company || '',
		leadType: client.leadType || '',
		leadSource: client.leadSource || '',
		// Use client tags if available, otherwise empty array
		tags: client.tags || [],
		lastActivity: client.lastActivity
	}));

	// Filter clients based on all criteria
	const filteredClients = clientsWithTags.filter(client => {
		const matchesSearch =
			client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			client.company.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesTags =
			selectedTags.length === 0 ||
			selectedTags.some(tag => client.tags && client.tags.includes(tag));

		const matchesLeadType =
			selectedLeadType === 'all' ||
			client.leadType === selectedLeadType;

		const mathcesLeadSource =
			selectedLeadSource === 'all' ||
			client.leadSource === selectedLeadSource;

		const matchesDateRange =
			(!dateRange?.from || new Date(client.lastActivity) >= dateRange.from) &&
			(!dateRange?.to || new Date(client.lastActivity) <= dateRange.to);

		return matchesSearch && matchesTags && matchesLeadType && mathcesLeadSource && matchesDateRange;
	});

	// Sort clients alphabetically
	const sortedClients = [...filteredClients].sort((a, b) => {
		if (!sortField) return 0;

		const aVal = a[sortField];
		const bVal = b[sortField];

		if (typeof aVal === 'string' && typeof bVal === 'string') {
			return sortDirection === 'asc'
				? aVal.localeCompare(bVal)
				: bVal.localeCompare(aVal);
		}

		if (aVal instanceof Date && bVal instanceof Date) {
			return sortDirection === 'asc'
				? aVal.getTime() - bVal.getTime()
				: bVal.getTime() - aVal.getTime();
		}
		
		return 0;
	});

	const clearFilters = () => {
		setSearchQuery('');
		setSelectedTags([]);
		setSelectedLeadType('all');
		setSelectedLeadSource('all');
		setDateRange(undefined);
	};

	const handleSort = (field: keyof typeof clientsWithTags[0]) => {
		if (sortField === field) {
			setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	return (
		<div className="space-y-4">
			{/*<div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative max-w-sm">*/}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search clients..."
						className="pl-8 w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						//className="pl-8"
					/>
				</div>

				<Button
					variant='outline'
					onClick={() => setShowFilters(!showFilters)}
					className='flex items-center gap-2'
				>
					<Filter className='h-4 w-4' />
					Filters
					{(selectedTags.length > 0 || selectedLeadType || selectedLeadSource || dateRange?.from || dateRange?.to) && (
						<Badge variant='secondary' className='ml-1'>
							{selectedTags.length +
								(selectedLeadType ? 1 : 0) +
								(selectedLeadSource ? 1 : 0) +
								(dateRange?.from || dateRange?.to ? 1 : 0)}
						</Badge>
					)}
				</Button>
			</div>

			{showFilters && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg'>
				{/* Lead Type */}
				<div className='space-y-2'>
					<Label>Lead Type</Label>
					<Select value={selectedLeadType} onValueChange={setSelectedLeadType}>
						<SelectTrigger id="leadType">
							<SelectValue placeholder="All Types" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Types</SelectItem>
							{leadTypes.map(type => (
								<SelectItem key={type} value={type}>{type}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			
				{/* Lead Source */}
				<div className='space-y-2'>
					<Label>Lead Source</Label>
					<Select value={selectedLeadSource} onValueChange={setSelectedLeadSource}>
						<SelectTrigger id="leadSource">
							<SelectValue placeholder="All Sources" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Sources</SelectItem>
							{leadSources.map(source => (
								<SelectItem key={source} value={source}>{source}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			
				{/* Date Range */}
				<div className='space-y-2'>
					<Label>Date Range</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant='outline' className='w-full justify-start text-left'>
								<Calendar className='mr-2 h-4 w-4' />
								{dateRange?.from ? (
									dateRange.to ? (
										<>
											{format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
										</>
									) : (
										format(dateRange.from, 'LLL dd, y')
									)
								) : (
									<span className="text-muted-foreground">Pick a date range</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0' align='start'>
							<CalendarComponent
								initialFocus
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={setDateRange}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
				</div>
			
				{/* Tags */}
				<div className='space-y-2'>
					<Label>Tags</Label>
					<div className='flex flex-wrap gap-2'>
						{allTags.map(tag => (
							<Badge
								key={tag}
								variant={selectedTags.includes(tag) ? "default" : "outline"}
								className='cursor-pointer'
								onClick={() => {
									setSelectedTags(prev =>
										prev.includes(tag)
											? prev.filter(t => t !== tag)
											: [...prev, tag]
									);
								}}
							>
								{tag}
							</Badge>
						))}
					</div>
				</div>
			
				{/* Clear Filters Button */}
				<div className='sm:col-span-2 lg:col-span-4 flex justify-end'>
					<Button
						variant='ghost'
						onClick={clearFilters}
						className='flex items-center gap-2'
					>
						<X className='h-4 w-4' />
						Clear Filters
					</Button>
				</div>
			</div>
			)}

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead onClick={() => handleSort('name')} className='cursor-pointer'>
							Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
						</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Company</TableHead>
						<TableHead>Lead Type</TableHead>
						<TableHead>Lead Source</TableHead>
						<TableHead>Tags</TableHead>
						<TableHead>Last Activity</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedClients.length > 0 ? (
						sortedClients.map((client) => (
							<TableRow
								key={client.id}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => navigate(`/clients/${client.id}`)}
							>
								<TableCell className="font-medium">{client.name}</TableCell>
								<TableCell>{client.email}</TableCell>
								<TableCell>{client.company}</TableCell>
								<TableCell>{client.leadType}</TableCell>
								<TableCell>{client.leadSource}</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{client.tags && client.tags.map(tag => (
											<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
										))}
									</div>
								</TableCell>
								<TableCell>
									{format(new Date(client.lastActivity), 'MMM d, yyyy')}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
								No clients found. Try adjusting your search or filters.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default ClientsTable;
