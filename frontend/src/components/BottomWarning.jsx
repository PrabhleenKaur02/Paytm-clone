import React from 'react'
import { Link } from 'react-router-dom'

const BottomWarning = ({label, to, buttonText}) => {
  return (
    <div className='py-2 text-sm flex justify-center'>
        <div>
            {label}
        </div>
        <Link className='pointer underline pl-1 curser-pointer' to={to}>
        {buttonText}
        </Link>
    </div>
  )
}

export default BottomWarning