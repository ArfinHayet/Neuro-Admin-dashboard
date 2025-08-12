import React from 'react'
import InviteClinicians from '../../Components/Clinicians/InviteClinicians'

const CliniciansOnboarding = () => {
  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 pb-20">
        <h1 className="font-medium text-2xl mb-4">Clinicians Onboarding</h1>
        <InviteClinicians />
        </section>
  )
}

export default CliniciansOnboarding