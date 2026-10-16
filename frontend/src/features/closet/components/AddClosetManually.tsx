import PageLayout from '@/layout/PageLayout'
import React, { useRef, useState } from 'react'
import CustomDropdownCloset from './CustomDropdown';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ImageIcon from '@/components/icons/ImageIcon';
import VoiceMorphingSVG from "@/pages/azugh/components/voice"; // adjust path if needed
import { BRAND_OPTIONS, COLOR_MAP, COLOR_OPTIONS, SEASON_ICON_MAP, SEASON_OPTIONS, SIZE_OPTIONS, TYPE_OPTIONS } from '../data';

const AddClosetManually = () => {
  const [type, setType] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showVoiceMorph, setShowVoiceMorph] = useState(true); // Show morph on mount
  const navigate = useNavigate()

  const typeRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !typeRef.current?.contains(e.target as Node) &&
        !colorRef.current?.contains(e.target as Node) &&
        !seasonRef.current?.contains(e.target as Node) &&
        !sizeRef.current?.contains(e.target as Node) &&
        !brandRef.current?.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  // Show morph on mount, hide after 3s
  React.useEffect(() => {
    if (showVoiceMorph) {
      const timer = setTimeout(() => setShowVoiceMorph(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showVoiceMorph]);

  const handleAddToCloset = () => {
    navigate('/matched-success', { state: { manual: true } });
  };

  return (
    <PageLayout className='justify-start bg-white'>
      <PageHeader title="Add Item Manually" showBackButton={true} showFilters={false} className='mb-4 mr-auto' />
      <div className="flex flex-col justify-start space-y-3 px-4 max-w-md mx-auto w-full">
        <CustomDropdownCloset
          label={type ? `type - ${type}` : "type"}
          value={type}
          options={TYPE_OPTIONS}
          onSelect={setType}
          isOpen={openDropdown === "type"}
          onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
          dropdownRef={typeRef}
        />
        <textarea
          className="w-full rounded-xl text-sm border border-black p-3 text-black font-manrope focus:outline-none focus:ring-0"
          placeholder="add details, e.g. slim fit, ripped, oversized.."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
        />
        <CustomDropdownCloset
          label={color ? `color - ${color}` : "color"}
          value={color}
          options={COLOR_OPTIONS}
          onSelect={setColor}
          isOpen={openDropdown === "color"}
          onToggle={() => setOpenDropdown(openDropdown === "color" ? null : "color")}
          dropdownRef={colorRef}
          renderOptionExtra={option => (
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 16,
            background: COLOR_MAP[option],
            marginRight: 8,
            verticalAlign: "middle"
          }}
        />
          )}
        />
        <CustomDropdownCloset
          label={season ? `season - ${season}` : "season"}
          value={season}
          options={SEASON_OPTIONS}
          onSelect={setSeason}
          isOpen={openDropdown === "season"}
          onToggle={() => setOpenDropdown(openDropdown === "season" ? null : "season")}
          dropdownRef={seasonRef}
          renderOptionExtra={option => (
        <span className="mr-2 flex items-center">
          <ImageIcon
            name={SEASON_ICON_MAP[option.toLowerCase()]}
            alt={option}
            width={18}
            height={18}
          />
        </span>
          )}
        />
        <CustomDropdownCloset
          label={size ? `size - ${size}` : "size"}
          value={size}
          options={SIZE_OPTIONS}
          onSelect={setSize}
          isOpen={openDropdown === "size"}
          onToggle={() => setOpenDropdown(openDropdown === "size" ? null : "size")}
          dropdownRef={sizeRef}
        />
        <CustomDropdownCloset
          label={brand ? `brand - ${brand}` : "brand"}
          value={brand}
          options={BRAND_OPTIONS}
          onSelect={setBrand}
          isOpen={openDropdown === "brand"}
          onToggle={() => setOpenDropdown(openDropdown === "brand" ? null : "brand")}
          dropdownRef={brandRef}
        />
      </div>
      <div className="flex w-full mt-4 mb-auto flex-col items-center justify-center gap-3 px-4 pb-8">
        <Button
          type="button"
          className="!h-12 !py-0 min-h-[48px] w-full max-w-sm mx-auto rounded-full
               bg-[#303A2FB2] hover:bg-[#303A2FB2]
               text-white font-light lowercase text-base leading-none
               flex items-center justify-center"
          onClick={handleAddToCloset}
        >
          add to closet
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="!h-12 !py-0 min-h-[48px] max-w-sm mx-auto rounded-full
       bg-transparent text-black font-light lowercase text-base leading-none
       hover:bg-transparent
       flex items-center justify-center"
          onClick={() => {
            setType(null);
            setColor(null);
            setSeason(null);
            setSize(null);
            setBrand(null);
            setNotes('');
            setOpenDropdown(null);
          }}
        >
          reset
        </Button>
      </div>

      {showVoiceMorph && (
        <div
          className="fixed left-0 right-0 top-0 bottom-0 z-[9999]
               w-screen h-screen min-h-[100vh]
               flex flex-col items-center justify-center
               bg-black/60 backdrop-blur-sm
               pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          style={{ height: '100svh' }}   // iOS 16.4+ dynamic viewport; h-screen is the fallback
        >
          <VoiceMorphingSVG width={300} height={300} />
          <div className="mt-[-3rem] text-center">
            <p className="text-xl text-white font-manrope">Azugh is filling in the details</p>
            <p className="text-white font-light font-manrope">tailoring details for your item...</p>
          </div>
        </div>
      )}

    </PageLayout>
  )
}

export default AddClosetManually