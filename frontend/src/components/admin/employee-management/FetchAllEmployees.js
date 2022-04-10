import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import UpdateEmployee from './UpdateEmployee'

const FetchAllEmployees = (props) => {
  const [employees, setEmployees] = useState([])
  const [results, setResults] = useState([])
  const [editEmployee, setEditEmployee] = useState(true)
  const [employee, setEmployee] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getEmployee = () => {
      axios
        .get('/api/employee/')
        .then((res) => {
          console.log(res)
          setEmployees(res.data)
        })
        .catch((err) => {
          alert(err.message)
        })
    }
    getEmployee()

    setLoading(false)
  }, [loading, setLoading])

  const viewUpdate = (employees) => {
    setEmployee(employees)
    setEditEmployee(!editEmployee)
  }

  const onDelete = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this data!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/employee/delete/${id}`).then((res) => {
          setLoading(true)
        })
        swal(
          'Deleted!',
          'You have successfully deleted the employee',
          'success'
        )
      }
    })
  }

  useEffect(() => {
    setEmployees(employees)
  }, [employees])

  useEffect(() => {
    if (searchInput === '') {
      setResults(employees)
    } else {
      let results = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchInput) ||
          employee.id.toLowerCase().includes(searchInput) ||
          employee.designation.toLowerCase().includes(searchInput) ||
          employee.address.toLowerCase().includes(searchInput)
      )
      setResults(results)
    }
  }, [searchInput, employees])

  const exportPDF = () => {
    const unit = 'pt'
    const size = 'A4'
    const orientation = 'portrait'

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = 'Employee Report'
    const headers = [
      ['ID', 'Name', 'Designation', 'Address', 'Email', 'contactNo'],
    ]

    const data = employees.map((employees) => [
      employees.id,
      employees.name,
      employees.designation,
      employees.address,
      employees.email,
      employees.contactNo,
    ])

    let content = {
      startY: 50,
      head: headers,
      body: data,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save('Employee Report.pdf')
  }

  return (
    <>
      {editEmployee ? (
        <div className=''>
          <div className='float-end'>
            <button className='btn btn-secondary' onClick={() => exportPDF()}>
              Generate Employee Report
            </button>
          </div>
          <form>
            <div className='col-2'>
              <input
                className='form-control'
                type='search'
                placeholder='Search employee'
                name='searchQue'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>
          <table class='table table-striped table-hover'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>ID</th>
                <th scope='col'>Name</th>
                <th scope='col'>Designation</th>
                {/* <th scope='col'>NIC</th> */}
                <th scope='col'>Address</th>
                <th scope='col'>Email</th>
                <th scope='col'>contactNo</th>
                <th scope='col'>Actions</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((employees, index) => (
                <tr key={employees.id}>
                  <th scope='row'>{index + 1}</th>
                  <td>{employees.id}</td>
                  <td>{employees.name}</td>
                  <td>{employees.designation}</td>
                  {/* <td>{employees.nic}</td> */}
                  <td>{employees.address}</td>
                  <td>{employees.email}</td>
                  <td>{employees.contactNo}</td>

                  <td>
                    <span
                      className='btn btn-primary'
                      onClick={() => {
                        viewUpdate(employees)
                        // setText()
                      }}
                    >
                      <i className='bi bi-pencil-square'></i>&nbsp;Edit
                    </span>
                    &nbsp;
                    <Link
                      to='#'
                      className='btn btn-danger'
                      onClick={() => onDelete(employees._id)}
                    >
                      <i className='bi bi-trash d-none d-lg-inline-block'></i>
                      &nbsp;Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <UpdateEmployee oneEmployee={employee} />
        </div>
      )}
    </>
  )
}

export default FetchAllEmployees
