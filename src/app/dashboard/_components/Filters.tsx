'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, X, Calendar, ArrowUpDown } from 'lucide-react'
import { DebouncedSearchInput } from './DebouncedSearch'
import { Controller } from 'react-hook-form'
import DateTime from '../_components/DateTime'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FilterForm, useFilter } from '@/context/FilterContext'

const Filters = () => {
    const { 
        methods, 
        query, 
        setQuery, 
        categories, 
        resetFilters,
        hasActiveFilters 
    } = useFilter()
    const { control, watch, setValue } = methods
    const { startDate, endDate } = watch()

    const handleFilterChange = (name: keyof FilterForm, value: string) => {
        setValue(name, value as string)
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

            <div className="grid items-end grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <DebouncedSearchInput
                    value={query}
                    onDebounceChange={setQuery}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <Controller
                        control={control}
                        name="sort"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    handleFilterChange('sort', value)
                                }}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center">
                                        <ArrowUpDown className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Sort options" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="title">Title</SelectItem>
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