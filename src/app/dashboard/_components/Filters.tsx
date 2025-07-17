'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, X, Calendar } from 'lucide-react'
import { DebouncedSearchInput } from './DebouncedSearch'
import { useRouter, useSearchParams } from 'next/navigation'
import { Event } from '@/lib/db'
import { useForm, Controller } from 'react-hook-form'
import DateTime from '../_components/DateTime'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type FilterType = 'All' | 'Online' | 'In-Person'

interface FilterProps {
    events: Event[]
    setFilteredEvents: (events: Event[]) => void
}

type FilterForm = {
    type: FilterType
    category: string
    startDate: Date | null
    endDate: Date | null
}

const Filters = ({ events, setFilteredEvents }: FilterProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const initialQuery = searchParams.get('query') || ''
    const [searchTerm, setSearchTerm] = useState(initialQuery)

    const categories = useMemo(
        () => Array.from(new Set(events.map(event => event.category))),
        [events]
    )

    const { control, watch, setValue, reset } = useForm<FilterForm>({
        defaultValues: {
            type: (searchParams.get('type') as FilterType) || 'All',
            category: searchParams.get('category') || 'All',
            startDate: null,
            endDate: null
        }
    })

    const { type, category, startDate, endDate } = watch()

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch =
                searchTerm.trim() === '' ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesType =
                type === 'All' || event.eventType === type

            const matchesCategory =
                category === 'All' || event.category === category

            const eventDate = new Date(event.startDateTime)
            const matchesDate =
                (!startDate || eventDate >= startDate) &&
                (!endDate || eventDate <= endDate)

            return matchesSearch && matchesType && matchesCategory && matchesDate
        })
    }, [events, searchTerm, type, category, startDate, endDate])

    useEffect(() => {
        setFilteredEvents(filteredEvents)
    }, [filteredEvents])

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(window.location.search)
        setSearchTerm(query)
        params.set('query', query)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleFilterChange = (name: keyof FilterForm, value: string) => {
        const params = new URLSearchParams(window.location.search)
        params.set(name, value)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const hasActiveFilters = useMemo(() => {
        return type !== 'All' ||
            category !== 'All' ||
            startDate !== null ||
            endDate !== null ||
            searchTerm !== ''
    }, [type, category, startDate, endDate, searchTerm])


    const resetFilters = () => {
        reset({
            type: 'All',
            category: 'All',
            startDate: null,
            endDate: null
        })
        setSearchTerm('')
        router.push('?', { scroll: false })
    }

    const hasDateFilters = startDate || endDate

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium text-gray-900">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                    >
                        Clear all
                        <X className="ml-1 h-3 w-3" />
                    </button>
                )}
            </div>

            <div className="grid items-end grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DebouncedSearchInput
                    value={searchTerm}
                    onDebounceChange={handleSearch}
                    placeholder="Search events by title or description..."
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    handleFilterChange('type', value)
                                }}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Types</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="In-Person">In-Person</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    handleFilterChange('category', value)
                                }}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`justify-start h-10 text-left font-normal ${hasDateFilters ? 'bg-indigo-50 border-indigo-200' : ''}`}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {hasDateFilters ? (
                                <>
                                    {startDate?.toLocaleDateString() || 'Any'} - {endDate?.toLocaleDateString() || 'Any'}
                                </>
                            ) : (
                                <span>Date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-4">
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                    <Controller
                                        control={control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <DateTime<FilterForm>
                                                label=""
                                                fieldName="startDate"
                                                watch={watch}
                                                setValue={(name, value) => {
                                                    setValue(name, value)
                                                    handleFilterChange(name, value?.toString() || '')
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <Controller
                                        control={control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <DateTime<FilterForm>
                                                label=""
                                                fieldName="endDate"
                                                watch={watch}
                                                setValue={(name, value) => {
                                                    setValue(name, value)
                                                    handleFilterChange(name, value?.toString() || '')
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default Filters