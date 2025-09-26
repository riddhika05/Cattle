import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {


  return (
    <>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button><div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">    <div class="modal-dialog shadow-xl">        <div class="modal-content">            <div class="modal-header">                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>                <i class="fa fa-ellipsis-v"></i>            </div>            <div class="modal-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</div>            <div class="modal-footer"><button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div>        </div>    </div></div>
    </>
  )
}

export default App
