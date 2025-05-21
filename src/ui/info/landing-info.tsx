import React from 'react'
import { lusitana } from '@/ui/fonts'

function LandingInfo() {
  return (
    <div>
        <div>
            <p className={`${lusitana.className} text-xl text-white md:text-3xl md:leading-normal text-center`}>
                <strong>List, itterate, review, write</strong>
            </p>
        </div>
        <p className={`${lusitana.className} text-xl text-white md:text-3xl md:leading-normal`}>
            <strong>
                A personal daily journal and todo list all in one app with detailed feedback for improving
                organization and workflow.
            </strong>
        </p>
        <p className={`${lusitana.className} text-xl text-white md:text-3xl md:leading-normal`}>
            <strong>
                Encrypted data ensure that what you write remains personal to you. We will never monitize or
                sell your data.
            </strong>
        </p>
        <div className="m-6">
				<p className={`${lusitana.className} text-xl text-white md:text-3xl md:leading-normal`}>
					<strong>Monthly content download available for retaining your information yourself.</strong>
				</p>
			</div>
    </div>
  )
}

export default LandingInfo