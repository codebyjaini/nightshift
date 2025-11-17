import React from 'react'

export interface FilterControlsProps {
  activeFilter: 'all' | 'treated' | 'untreated'
  onFilterChange: (filter: 'all' | 'treated' | 'untreated') => void
}

declare const FilterControls: React.FC<FilterControlsProps>

export default FilterControls
