import Header from 'components/Header'
import React from 'react'

const dashboard = () => {
  const user = { name: 'Rojail'}
  return (
    <main className='dashboard wrapper'>
      
      <Header 
        title={`Welcome ${user?.name ?? 'Guest'} 👋`}
        description="Track activity, trends and popular desitinations in real time" 
      />

      Dashboard Page Contents
    </main>
  )
}

export default dashboard