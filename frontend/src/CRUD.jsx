import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CRUD.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CRUD = () => {

    const empdata = [
        {
            id: 1,
            name: 'John Doe',
            ege: 25,
            isActive: true
        },
        {
            id: 2,
            name: 'Thomas Doe',
            ege: 23,
            isActive: false
        },
        {
            id: 3,
            name: 'Tom Smith',
            ege: 30,
            isActive: true
        }
    ]
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7292/api/employee').then((res) => {
            setData(res.data)
        }).catch((err) => {
            toast.error(err)
        })
    }

    const clearAllField = () => {
        setName('');
        setAge('');
        setIsActive(false);
        setEditName('');
        setEditAge('');
        setEditIsActive(false);
        setEditId('');
    }

    const handleSave = () => {
        const url = 'https://localhost:7292/api/employee';
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }
        axios.post(url, data).then((res) => {
            getData();
            clearAllField();
            toast.success('Data saved successfully');
        }).catch((err) => {
            ctoast.error(err)
        })
    }

    const handleEdit = (id) => {
        handleShow();
        const url = `https://localhost:7292/api/employee/${id}`;
        axios.get(url).then((res) => {
            setEditId(id);
            setEditName(res.data.name);
            setEditAge(res.data.age);
            setEditIsActive(res.data.isActive);
        }).catch((err) => {
            toast.error(err)
        });
    }
    const handleUpdate = () => {
        const url = `https://localhost:7292/api/employee/${editId}`;
        const data = {
            "id": editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(url, data).then((res) => {
            handleClose();
            getData();
            clearAllField();
            toast.success('Data updated successfully');
        }).catch((err) => {
            toast.error(err)
        });
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            axios.delete(`https://localhost:7292/api/employee/${id}`).then((res) => {
                getData();
                toast.success('Data deleted successfully');
            }
            ).catch((err) => {
                toast.error(err)
            });
        }
    }



    // modal pop up

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(false);

    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(false);



    return (
        <>
            <Container className='mb-2 ml-2'>
                <ToastContainer />
                <Row>
                    <Col>
                        <input type="text" placeholder="Enter Name" className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" placeholder="Enter Age" className='form-control' value={age} onChange={(e) => setAge(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} value={isActive} />
                        <label>IsActive</label>
                    </Col>
                    <Col>
                        <button className='btn btn-primary' onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <div className="table-container">

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>IsActive</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.length > 0 ?
                                data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.age}</td>
                                            <td>{item.isActive ? 'Yes' : 'No'}</td>
                                            <td colSpan={2}>
                                                <button className='btn btn-info' onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                                <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan="5">No data found</td>
                                </tr>
                        }
                    </tbody>
                </Table>

            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify / Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" placeholder="Enter Name" className='form-control' value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Enter Age" className='form-control' value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} value={editIsActive} />
                            <label>IsActive</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CRUD;
