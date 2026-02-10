import { MDBFooter } from 'mdb-react-ui-kit'
import React from 'react'

function Footer() {
  return (
    <>
      <MDBFooter bgColor='light' className='text-center text-lg-left' style={{position:'relative',zIndex:'2'}}>
      <div className='text-center p-3' >
        &copy; {new Date().getFullYear()} Copyright:{' '}
        <a className='text-dark' href='https://' style={{textDecoration:'none'}}>
          ProfessorX.com
        </a>
      </div>
    </MDBFooter>
    </>
  )
}

export default Footer
