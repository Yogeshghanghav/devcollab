import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createChannel } from '../../features/chat/chatSlice'
import Modal from '../ui/Modal'
import toast from 'react-hot-toast'

export default function CreateChannelModal({ open, onClose }) {
  const dispatch = useDispatch()
  const [name, setName]   = useState('')
  const [desc, setDesc]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const res = await dispatch(createChannel({ name: name.trim(), description: desc.trim() }))
    setLoading(false)
    if (res.error) {
      toast.error(res.payload || 'Failed to create channel')
    } else {
      toast.success(`#${res.payload.name} created!`)
      setName(''); setDesc('')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Channel">
      <form onSubmit={handle} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1.5">Channel Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value.toLowerCase().replace(/\s+/g,'-'))}
            placeholder="e.g. backend-team"
            className="input-base"
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1.5">Description (optional)</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's this channel about?" className="input-base" />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={loading || !name.trim()} className="btn-primary">
            {loading ? 'Creating…' : 'Create Channel'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
