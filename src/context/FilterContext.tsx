'use client'

import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { Event } from '@/lib/db'
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form'
import { useSearchParams, useRouter } from 'next/navigation'

export type EventType = 'All' | 'Online' | 'In-Person'
export type SortOption = 'date' | 'title'

export type FilterForm = {
    type: EventType
    category: string
    startDate: Date | null
    endDate: Date | null
    sort: SortOption
}
interface FilterContextType {
    methods: UseFormReturn<FilterForm>
    filteredEvents: Event[]
    query: string
    setQuery: (q: string) => void
    categories: string[]
    resetFilters: () => void
    hasActiveFilters: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ events, children }: { events: Event[]; children: React.ReactNode }) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const getInitialValue = <T,>(
        key: string,
        defaultValue: T,
        parser?: (val: string) => T
    ): T => {

        const param = searchParams.get(key)
        if (!param) return defaultValue

        return parser ? parser(param) : param as unknown as T
    }

    const methods = useForm<FilterForm>({
        defaultValues: {
            type: getInitialValue<EventType>('type', 'All'),
            category: getInitialValue<string>('category', 'All'),
            startDate: getInitialValue<Date | null>('startDate', null, (val) => new Date(val)),
            endDate: getInitialValue<Date | null>('endDate', null, (val) => new Date(val)),
            sort: getInitialValue<SortOption>('sort', 'date'),
        },
    })

    const { watch, reset } = methods
    const { type, category, startDate, endDate, sort } = watch()
    const [query, setQuery] = useState(getInitialValue<string>('query', ''))

    useEffect(() => {

        const params = new URLSearchParams()
        if (query) params.set('query', query)
        if (type !== 'All') params.set('type', type)
        if (category !== 'All') params.set('category', category)
        if (startDate) params.set('startDate', startDate.toISOString())
        if (endDate) params.set('endDate', endDate.toISOString())
        if (sort !== 'date') params.set('sort', sort)

        router.push(`?${params.toString()}`, { scroll: false })
    }, [query, type, category, startDate, endDate, sort, router])

    const categories: string[] = ['Conference', 'Workshop', 'Webinar', 'Meetup', 'Hackathon', 'Other'];

    const hasActiveFilters = useMemo(() => (
        query !== '' ||
        type !== 'All' ||
        category !== 'All' ||
        startDate !== null ||
        endDate !== null ||
        sort !== 'date'

    ), [query, type, category, startDate, endDate, sort])

    const filteredEvents = useMemo(() => {

        const result = events.filter(event => {
            const matchesQuery = !query ||
                [event.title, event.description].some(field =>
                    field.toLowerCase().includes(query.toLowerCase())
                )
            const matchesType = type === 'All' || event.eventType === type
            const matchesCategory = category === 'All' || event.category === category
            const eventDate = new Date(event.startDateTime)
            const matchesDate = (!startDate || eventDate >= startDate) &&
                (!endDate || eventDate <= endDate)

            return matchesQuery && matchesType && matchesCategory && matchesDate
        })

        return sort === 'title'
            ? [...result].sort((a, b) => a.title.localeCompare(b.title))
            : [...result].sort((a, b) => (
                new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
            ))


    }, [events, query, type, category, startDate, endDate, sort])

    const resetFilters = () => {
        reset({
            type: 'All',
            category: 'All',
            startDate: null,
            endDate: null,
            sort: 'date',
        })
        setQuery('')
    }

    return (
        <FilterContext.Provider value={{
            methods,
            filteredEvents,
            query,
            setQuery,
            categories,
            resetFilters,
            hasActiveFilters
        }}>
            <FormProvider {...methods}>{children}</FormProvider>
        </FilterContext.Provider>
    )
}

export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider')
    }
    return context
}