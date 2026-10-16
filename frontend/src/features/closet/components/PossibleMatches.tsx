import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useClosetStore } from '../store/closetStore'
import PageHeader from '@/components/PageHeader'
import ProductCard from '@/components/ProductCard'
import { X } from 'lucide-react'
import { ITEMS_OPTIONS } from '../mockData'
import PageLayout from '@/layout/PageLayout'

interface PossibleMatchesProps {
    className?: string
}

const SKELETON_CLASS = "animate-pulse bg-white w-full h-full min-h-[432px] flex flex-col items-center justify-start shadow-inner border border-gray-200 p-4"

const SkeletonCard = () => (
    <div className={SKELETON_CLASS}>
        {/* Image skeleton */}
        <div className="w-full h-[120px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-lg mb-4" />
        {/* Text line skeletons */}
        <div className="w-3/4 h-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded mb-2" />
        <div className="w-1/2 h-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded mb-2" />
        <div className="w-1/3 h-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded" />
    </div>
)

const PossibleMatches = ({ className }: PossibleMatchesProps) => {
    const navigate = useNavigate()
    const { capturedImages } = useClosetStore()
    const [items, setItems] = useState(() => ITEMS_OPTIONS.slice(0, 4))
    const [loadingIndexes, setLoadingIndexes] = useState<number[]>([])

    const [selectedIndex, setSelectedIndex] = useState<number>(0); // Preselect first product

    const handleRemove = (index: number) => {
        setLoadingIndexes(prev => [...prev, index])
        setTimeout(() => {
            setItems(prev => {
                const newItems = [...prev]
                const randomItem = ITEMS_OPTIONS[Math.floor(Math.random() * ITEMS_OPTIONS.length)]
                newItems[index] = {
                    ...randomItem,
                    label: randomItem.label,
                    images: Array.isArray(randomItem.images) ? randomItem.images : [randomItem.images || randomItem.icon],
                    icon: randomItem.icon,
                    price: randomItem.price || Math.floor(Math.random() * 200) + 50,
                    brand: randomItem.brand || 'Brand',
                    value: randomItem.value || '',
                    badgeType: randomItem.badgeType || ''
                }
                return newItems
            })
            setLoadingIndexes(prev => prev.filter(i => i !== index))
        }, 3000)
    }

    return (
        <PageLayout>
            <div className="w-full h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto overflow-y-auto bg-white">
                <PageHeader
                    title="possible matches"
                    showBackButton={true}
                    showFilters={false}
                    className='mb-2'
                />

                <div className="grid grid-cols-2 gap-0 px-0 mb-2 md:grid-cols-4 md:px-4">
                    {items.map((item, index) => (
                        <div key={index} className="w-full relative">
                            {!loadingIndexes.includes(index) && (
                                <button
                                    className="absolute top-[1px] right-[2px] z-20 bg-white w-7 h-7 flex items-center justify-center"
                                    onClick={() => handleRemove(index)}
                                    aria-label="Remove"
                                >
                                    <X />
                                </button>
                            )}
                            {loadingIndexes.includes(index) ? (
                                <SkeletonCard />
                            ) : (
                                <ProductCard
                                    id={`possible-match-${index}`}
                                    name={item.label}
                                    image={item.images?.[0] || item.icon}
                                    price={item.price || 0}
                                    brand={item.brand || ''}
                                    className={`border border-black -ml-px w-full h-full transition-opacity duration-200 ${selectedIndex === index ? 'opacity-100' : 'opacity-60'}`}
                                    showHeart={false}
                                    showPrice={false}
                                    showCart={false}
                                    showSelect={true}
                                    isSelected={selectedIndex === index}
                                    onSelectClick={() => setSelectedIndex(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex flex-row pb-[30vh] md:pb-[4vh] px-3 gap-2">
                    <Button
                        type="button"
                        className="!h-12 !py-0 min-h-[48px] w-[50%] max-w-sm mx-auto rounded-full
                        bg-[#303A2FB2] hover:bg-[#303A2FB2]
                        text-white font-light lowercase text-base leading-none
                        flex items-center justify-center mb-2"
                        onClick={() => navigate('/matched-success', { state: { manual: false } })} // <-- update here
                    >
                        add to closet
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        className="!h-12 !py-0 min-h-[48px] w-[50%] max-w-sm mx-auto rounded-full
                        text-base leading-none font-light
                        hover:bg-transparent
                        flex items-center justify-center"
                        onClick={() => navigate('/closet/add-manually')}
                    >
                        not here
                    </Button>
                </div>
            </div>
        </PageLayout>
    )
}

export default PossibleMatches
