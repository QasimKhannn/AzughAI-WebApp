import PageLayout from '@/layout/PageLayout'
import { Loader2 } from 'lucide-react'

const ClosetLoader = () => {
    return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-white">
                <Loader2 className="animate-spin w-10 h-10 text-[#141414]" />
                <p className="mt-4 text-2xl lowercase font-manrope">finding matches...</p>
                <p className="mt-2 text-base lowercase font-manrope">this may take a moment</p>
            </div>
    )
}

export default ClosetLoader