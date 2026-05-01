import { HashtagIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function ChannelHeader({ channel, dmUser }) {
  if (dmUser) {
    return (
      <div className="h-14 px-4 border-b border-bg-border flex items-center gap-3 flex-shrink-0 bg-bg-surface/80 backdrop-blur-sm">
        <UserIcon className="w-4 h-4 text-text-muted" />
        <div>
          <span className="font-semibold text-sm text-text-primary">{dmUser.name}</span>
          <span className="ml-2 text-xs text-text-muted">{dmUser.role}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button className="btn-ghost p-2"><MagnifyingGlassIcon className="w-4 h-4" /></button>
        </div>
      </div>
    )
  }

  if (!channel) return <div className="h-14 border-b border-bg-border flex-shrink-0" />

  return (
    <div className="h-14 px-4 border-b border-bg-border flex items-center gap-3 flex-shrink-0 bg-bg-surface/80 backdrop-blur-sm">
      <HashtagIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm text-text-primary">{channel.name}</span>
        {channel.description && (
          <span className="ml-3 text-xs text-text-muted truncate">{channel.description}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button className="btn-ghost p-2"><MagnifyingGlassIcon className="w-4 h-4" /></button>
      </div>
    </div>
  )
}
