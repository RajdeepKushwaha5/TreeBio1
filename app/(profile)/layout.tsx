import React from 'react'
import { Footer } from '@/components/footer'

const ProfileLayout = ({ children }:{children: React.ReactNode}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      <Footer variant="minimal" />
    </div>
  )
}

export default ProfileLayout