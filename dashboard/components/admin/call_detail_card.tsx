import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Building,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'

const CallDetailCard = ({ event }: any) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: any) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getVerdictInfo = (verdict: string) => {
    switch (verdict) {
      case 'bad':
        return {
          icon: <XCircle size={16} />,
          color: 'text-red-400',
          bgColor: 'bg-red-950/40',
          label: 'Poor Quality'
        }
      case 'good':
        return {
          icon: <CheckCircle size={16} />,
          color: 'text-green-400',
          bgColor: 'bg-green-950/40',
          label: 'Good Quality'
        }
      case 'needs_review':
        return {
          icon: <AlertCircle size={16} />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-950/40',
          label: 'Need Review'
        }
      default:
        return {
          icon: <Eye size={16} />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-950/40',
          label: 'Reviewed'
        }
    }
  }

  const verdictInfo = getVerdictInfo(event.verdict)

  return (
    <div className="relative bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition hover:bg-zinc-900">

      {/* CREATED TIME – half out */}
      <div className="absolute -top-3 right-4 bg-zinc-900 border border-green-700 px-3 py-1 rounded-full text-xs text-green-500">
        {formatDate(event.created_at)}
      </div>

      {/* HEADER */}
      <div className="p-6 flex justify-between gap-4">
          {/* Basic Info */}
          <div className="flex flex-wrap gap-6">
            {/* Verdict */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${verdictInfo.bgColor}`}>
                {verdictInfo.icon}
                <span className={`text-sm font-medium ${verdictInfo.color}`}>
                {verdictInfo.label}
                </span>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <span className="font-mono text-sm text-gray-300">
                {event.call_id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <span className="text-sm text-gray-300">
                {event.phone}
              </span>
            </div> 

            <div className="flex items-center gap-2">
              <Building size={16} className="text-gray-500" />
              <span className="text-sm text-gray-400">
                {event.dealership_id.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

        {/* Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 h-fit px-4 py-2 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 rounded-lg">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'View Less' : 'View Details'}
        </button>
      </div>

      {/* EXPANDED */}
      {isExpanded && (
        <div className="border-t border-zinc-800 p-6 space-y-6">

          {/* AI Analysis */}
          <Section title="Call Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Name" value={event.name==='Optional' ? "Na" : event.name} />
                <Info label="Duration" value={event.duration_sec + " second"}/>
                <Info label="Call Time" value={formatDate(event.timestamp)} />
                <Info label="Channel" value={event.channel} />
                <Info label="AI Engine" value={event.ai_engine} />
            </div>
          </Section>

          {/* Meta Info */}
          <Section title="AI Analysis ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Score" value={event.score} />
                <Info label="Confidence" value={event.confidence} />
            </div>
          </Section>

          {/* Recommended Action */}
          <Section title="Recommended Action">
            <div className="text-sm text-gray-300">
              {event.recommended_action === 'none'
                ? 'No action required'
                : event.recommended_action}
            </div>
          </Section>

          {/* flags */}
          {event.flags?.length > 0 && (
            <Section title="AI Flags">
              <ul className="space-y-2">
                {event.flags.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-gray-400">• {r}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Reasons */}
          {event.reasons?.length > 0 && (
            <Section title="AI Reasons">
              <ul className="space-y-2">
                {event.reasons.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-gray-400">• {r}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Transcript */}
          <Section title="Transcript Preview">
            <div className="bg-black rounded-lg p-4 text-sm font-mono text-gray-300 max-h-48 overflow-auto">
              {event.transcript === '...'
                ? <span className="italic text-gray-500">Transcript not available</span>
                : event.transcript}
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}

const Section = ({ title, children }: any) => (
  <div className="space-y-3">
    <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
    {children}
  </div>
)

const Info = ({ label, value }: any) => (
  <div className="flex justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-200">{value}</span>
  </div>
)

export default CallDetailCard
