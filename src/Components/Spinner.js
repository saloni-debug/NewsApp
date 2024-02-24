import React from 'react'
import loading from './Rocket.gif'

const Spinner = ()=> {  
    return (
      <div className='text-center' style={{height:'300px'}}>
            <img src={loading} alt="loading"/>
      </div>
    )
}

export default Spinner
