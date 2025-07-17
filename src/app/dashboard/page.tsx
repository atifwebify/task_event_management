import React, { Suspense } from 'react'
import Home from './Home'
import { Loader } from './_components/Loader'


const page = async () => {


    return (
        <Suspense fallback={
            <div className='min-h-screen w-full flex items-center justify-center'>
                <Loader />
            </div>
        }>
            <Home />
        </Suspense >
    )
}

export default page
