import Button from '../ui/Button'

/**
 * FilterControls Component
 * Provides filter buttons for patient list (All, Untreated, Treated)
 * 
 * @param {Object} props
 * @param {string} props.activeFilter - Currently active filter: 'all', 'untreated', or 'treated'
 * @param {Function} props.onFilterChange - Callback when filter is changed
 */
const FilterControls = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'untreated', label: 'Untreated' },
    { value: 'treated', label: 'Treated' },
  ]

  return (
    <div 
      className="flex gap-3 flex-wrap" 
      role="group" 
      aria-label="Filter patients by treatment status"
    >
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? 'primary' : 'ghost'}
          onClick={() => onFilterChange(filter.value)}
          className="min-w-[100px]"
          aria-pressed={activeFilter === filter.value}
          aria-label={`Show ${filter.label.toLowerCase()} patients`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}

export default FilterControls
