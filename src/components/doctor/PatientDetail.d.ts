import { Patient } from '../../hooks/usePatients'

export interface PatientDetailProps {
  patient: Patient
  onMarkTreated: () => void
  onMarkNotTreated: () => void
  onMarkContacted: () => void
  onDelete: () => void
  onClose: () => void
  loading?: boolean
  contactLoading?: boolean
  deleteLoading?: boolean
}

declare const PatientDetail: React.FC<PatientDetailProps>
export default PatientDetail
