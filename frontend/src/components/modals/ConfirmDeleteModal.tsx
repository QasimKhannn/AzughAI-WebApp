import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'

type ConfirmDeleteModalProps = {
    open: boolean
    onClose: () => void
    onDelete?: () => void
    title?: string
    description?: string
    deleteLabel?: string
    cancelLabel?: string
}

const ConfirmDeleteModal = ({
    open,
    onClose,
    onDelete,
    title = "Delete Conversation",
    description = "This conversation will be permanently removed from your history. You won’t be able to view its summary again.",
    deleteLabel = "Delete",
    cancelLabel = "Cancel",
}: ConfirmDeleteModalProps) => {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[80%] rounded-xl bg-white flex flex-col gap-4">
                <DialogHeader className='pt-4 pb-1'>
                    <DialogTitle className='font-semibold font-manrope'>{title}</DialogTitle>
                </DialogHeader>
                <p className="text-center text-sm font-manrope">
                    {description}
                </p>
                <DialogFooter className="flex justify-center items-center gap-2">
                    <DialogClose asChild>
                        <Button
                            variant='ghost'
                            className='rounded-full w-32 text-white bg-[#AA9C64] font-light font-manrope lowercase'
                            onClick={onDelete}
                        >
                            {deleteLabel}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className='font-light font-manrope lowercase rounded-full w-32'>
                            {cancelLabel}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDeleteModal
