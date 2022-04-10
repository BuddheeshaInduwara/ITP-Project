import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'
import jsPDF from 'jspdf'

import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const FetchAllSalary = () => {
  const [salaries, setSalaries] = useState([])
  const [results, setResults] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSalary = () => {
      axios
        .get('/api/salary/')
        .then((res) => {
          console.log(res)
          setSalaries(res.data)
        })
        .catch((err) => {
          alert(err.message)
        })
    }
    getSalary()

    setLoading(false)
  }, [loading, setLoading])

  const onDelete = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this data!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/salary/delete/${id}`).then((res) => {
          setLoading(true)
        })
        swal('Deleted!', 'You have successfully deleted the salary', 'success')
      }
    })
  }

  useEffect(() => {
    setSalaries(salaries)
  }, [salaries])

  useEffect(() => {
    if (searchInput === '') {
      setResults(salaries)
    } else {
      let results = salaries.filter(
        (salary) =>
          salary.employeeId.toLowerCase().includes(searchInput) ||
          salary.year.toLowerCase().includes(searchInput) ||
          salary.month.toLowerCase().includes(searchInput)
      )
      setResults(results)
    }
  }, [searchInput, salaries])

  const exportPDF = () => {
    const unit = 'pt'
    const size = 'A4'
    const orientation = 'portrait'

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = 'Salary Report'
    const headers = [
      [
        'Employee ID',
        'Year',
        'Month',
        'Basic Salary',
        'COl Allo.',
        'Medi Allo.',
        'Tax Dedu.',
        'Net Salary',
      ],
    ]

    const data = salaries.map((salaries) => [
      salaries.employeeId,
      salaries.year,
      salaries.month,
      salaries.basicSalary,
      salaries.colAllowance,
      salaries.mediAllowance,
      salaries.taxDeduction,
      salaries.basicSalary +
        salaries.colAllowance +
        salaries.mediAllowance -
        salaries.taxDeduction,
    ])

    let content = {
      startY: 50,
      head: headers,
      body: data,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save('Salary Report.pdf')
  }

  const salarySlip = (id) => {
    axios
      .get(`/api/salary/get/${id}`)
      .then((res) => {
        const salary = res.data
        console.log('hello')

        const netSal =
          salary.salary.basicSalary +
          salary.salary.colAllowance +
          salary.salary.mediAllowance -
          salary.salary.taxDeduction

        var doc = new jsPDF('landscape', 'px', 'a4', 'false')

        doc.setFont('Helvertica', 'bold')
        doc.setFontSize(20)
        doc.text(60, 60, 'Tech Gear - Salary Slip')
        doc.setFontSize(18)
        doc.text(60, 80, 'Employee Id')
        doc.text(60, 100, 'Year')
        doc.text(60, 120, 'Month')
        doc.text(60, 150, 'Basic Salary')
        doc.text(60, 170, 'COL Allowance')
        doc.text(60, 190, 'Medical Allowance')
        doc.text(60, 210, 'Tax Deduction')
        doc.text(60, 230, 'Net Salary')

        doc.text(200, 80, ':')
        doc.text(200, 100, ':')
        doc.text(200, 120, ':')
        doc.text(200, 150, ':')
        doc.text(200, 170, ':')
        doc.text(200, 190, ':')
        doc.text(200, 210, ':')
        doc.text(200, 230, ':')

        doc.setFont('Helvertica', 'normal')
        doc.text(250, 80, salary.salary.employeeId)
        doc.text(250, 100, salary.salary.year)
        doc.text(250, 120, salary.salary.month)
        doc.text(250, 150, salary.salary.basicSalary.toString())
        doc.text(255, 170, salary.salary.colAllowance.toString())
        doc.text(255, 190, salary.salary.mediAllowance.toString())
        doc.text(255, 210, salary.salary.taxDeduction.toString())
        doc.setFont('Helvertica', 'bold')
        doc.text(250, 230, netSal.toString())

        doc.save('Salary Slip.pdf')
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  return (
    <div className=''>
      <div className='float-end'>
        <button className='btn btn-secondary' onClick={() => exportPDF()}>
          Generate Salary Report
        </button>
      </div>
      <form>
        <div className='col-2'>
          <input
            className='form-control'
            type='search'
            placeholder='Search salary'
            name='searchQue'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </form>
      <table className='table table-striped table-hover' id='saltable-to-xls'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Employee ID</th>
            <th scope='col'>Year</th>
            <th scope='col'>Month</th>
            <th scope='col'>Basic Salary</th>
            <th scope='col'>COl Allo.</th>
            <th scope='col'>Medi Allo.</th>
            <th scope='col'>Tax Dedu.</th>
            <th scope='col'>Net Salary</th>
            <th scope='col'>Actions</th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {results.map((salaries, index) => (
            <tr key={salaries._id}>
              <th scope='row'>{index + 1}</th>
              <td>{salaries.employeeId}</td>
              <td>{salaries.year}</td>
              <td>{salaries.month}</td>
              <td>{salaries.basicSalary}</td>
              <td>{salaries.colAllowance}</td>
              <td>{salaries.mediAllowance}</td>
              <td>{salaries.taxDeduction}</td>
              <td>
                {salaries.basicSalary +
                  salaries.colAllowance +
                  salaries.mediAllowance -
                  salaries.taxDeduction}
              </td>
              <td>
                <span
                  className='btn btn-secondary'
                  onClick={() => salarySlip(salaries._id)}
                >
                  <i className='bi bi-file-earmark-text'></i>&nbsp;Slip
                </span>
                &nbsp;
                <Link
                  to='#'
                  className='btn btn-danger'
                  onClick={() => onDelete(salaries._id)}
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
  )
}

export default FetchAllSalary
