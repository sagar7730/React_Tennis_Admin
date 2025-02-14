
// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Swal from 'sweetalert2';



// function Faq() {
//     const [show, setShow] = useState(false);
//     const [formData, setFormData] = useState({
//         question: '',
//         answer: ''
//     });
//     const [faqs, setFaqs] = useState([]);
//     const [currentFaqId, setCurrentFaqId] = useState(null);

//     const showAutoCloseAlert = (message) => {
//         Swal.fire({
//             position: "top-end",
//             icon: "success",
//             title: message,
//             showConfirmButton: false,
//             timer: 1500,
//         });
//     };

//     const showAutoError = (message) => {
//         Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: message,
//             showConfirmButton: false,
//             timer: 3000,
//         });
//     };

//     const fetchFaqs = async () => {
//         try {
//             const token = localStorage.getItem('admin_token');
//             const response = await axios.get('http://34.47.154.170/api/admin/faqs', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setFaqs(response.data);
//         } catch (error) {
//             console.error('Error fetching FAQs:', error);
//         }
//     };

//     useEffect(() => {
//         fetchFaqs();
//     }, []);

//     const handleShow = () => {
//         setShow(true);
//         setFormData({ question: '', answer: '' });
//         setCurrentFaqId(null);
//     };

//     const handleClose = () => setShow(false);

//     const handlePostData = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('admin_token');
//         const url = currentFaqId
//             ? `http://34.47.154.170/api/admin/faq/edit/${currentFaqId}`
//             : 'http://34.47.154.170/api/admin/faq/create';

//         try {
//             const response = await axios[currentFaqId ? 'put' : 'post'](url, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (currentFaqId) {
//                 setFaqs((prevFaqs) =>
//                     prevFaqs.map((faq) =>
//                         faq._id === currentFaqId ? { ...faq, ...formData } : faq
//                     )
//                 );
//             } else {
//                 setFaqs((prevFaqs) => [...prevFaqs, { _id: response.data._id, ...formData }]);
//             }
//             await fetchFaqs();
//             handleClose();
//         } catch (error) {
//             console.error('Error saving FAQ:', error.response ? error.response.data : error);
//             showAutoError('Failed to save FAQ. Please try again.');
//         }
//     };

//     const handleDelete = async (faqId) => {
//         const token = localStorage.getItem('admin_token');

//         try {
//             await axios.delete(`http://34.47.154.170/api/admin/faq/delete/${faqId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             await fetchFaqs();
//             setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== faqId));
//             showAutoCloseAlert('FAQ deleted successfully.');
//         } catch (error) {
//             console.error('Error deleting FAQ:', error);
//             showAutoError('Failed to delete FAQ. Please try again.');
//         }
//     };

//     const handleEdit = (id) => {
//         const faq = faqs.find((item) => item._id === id);
//         if (faq) {
//             setFormData({
//                 question: faq.question,
//                 answer: faq.answer,
//             });
//             setCurrentFaqId(id);
//             setShow(true);
//         }
//     };

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <div>
//                 <Button variant="primary" onClick={handleShow} style={{ marginBottom: '10px' }}>
//                     Add FAQ
//                 </Button>

//                 <Modal show={show} onHide={handleClose} centered>
//                     <Modal.Header closeButton>
//                         <Modal.Title>{currentFaqId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group controlId="formQuestion">
//                                 <Form.Label>Question</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Enter your question"
//                                     value={formData.question}
//                                     onChange={handlePostData}
//                                     name="question"
//                                     required
//                                 />
//                             </Form.Group>
//                             <Form.Group controlId="formAnswer">
//                                 <Form.Label>Answer</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     placeholder="Enter the answer"
//                                     value={formData.answer}
//                                     onChange={handlePostData}
//                                     name="answer"
//                                     required
//                                     rows={3}
//                                 />
//                             </Form.Group>
//                             <Modal.Footer>
//                                 <Button variant="primary" type="submit">
//                                     {currentFaqId ? 'Update' : 'Submit'}
//                                 </Button>
//                                 <Button variant="secondary" onClick={handleClose}>
//                                     Close
//                                 </Button>
//                             </Modal.Footer>
//                         </Form>
//                     </Modal.Body>
//                 </Modal>

//                 <Row xs={1} sm={2} md={3} className="g-4">
//                     {faqs.map((faq, index) => (
//                         <Col key={faq._id}>
//                             <Card style={{ height: '100%', borderRadius: '5px', backgroundColor: "#c5c5c5eb", color: "black" }}>
//                                 <Card.Body>
//                                     <Card.Title>{`${index + 1}. ${faq.question}`}</Card.Title>
//                                     {/* Add white-space: pre-wrap style to preserve line breaks */}
//                                     <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{faq.answer}</Card.Text>
//                                     <div className="d-flex">
//                                         <Button onClick={() => handleEdit(faq._id)} style={{ backgroundColor: 'black', border: 'none', marginRight: '5px' }}>
//                                             <i className="bi bi-pencil-square"></i>
//                                         </Button>
//                                         <Button variant="danger" onClick={() => handleDelete(faq._id)} style={{ backgroundColor: 'black', border: 'none' }}>
//                                             <i className="bi bi-trash3"></i>
//                                         </Button>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     ))}
//                 </Row>
//             </div>
//         </DashboardLayout>
//     );
// }



// export default Faq;

import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for React Quill
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from 'sweetalert2';

function Faq() {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
    });
    const [faqs, setFaqs] = useState([]);
    const [currentFaqId, setCurrentFaqId] = useState(null);

    const quillRef = useRef(null);

    const showAutoCloseAlert = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
    };

    const showAutoError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    const fetchFaqs = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('http://34.47.154.170/api/admin/faqs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleShow = () => {
        setShow(true);
        setFormData({ question: '', answer: '' });
        setCurrentFaqId(null);
    };

    const handleClose = () => setShow(false);

    const handlePostData = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuillChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            answer: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const url = currentFaqId
            ? `http://34.47.154.170/api/admin/faq/edit/${currentFaqId}`
            : 'http://34.47.154.170/api/admin/faq/create';

        try {
            const response = await axios[currentFaqId ? 'put' : 'post'](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (currentFaqId) {
                setFaqs((prevFaqs) =>
                    prevFaqs.map((faq) =>
                        faq._id === currentFaqId ? { ...faq, ...formData } : faq
                    )
                );
            } else {
                setFaqs((prevFaqs) => [...prevFaqs, { _id: response.data._id, ...formData }]);
            }
            await fetchFaqs();
            handleClose();
        } catch (error) {
            console.error('Error saving FAQ:', error.response ? error.response.data : error);
            showAutoError('Failed to save FAQ. Please try again.');
        }
    };

    const handleDelete = async (faqId) => {
        const token = localStorage.getItem('admin_token');

        try {
            await axios.delete(`http://34.47.154.170/api/admin/faq/delete/${faqId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchFaqs();
            setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== faqId));
            showAutoCloseAlert('FAQ deleted successfully.');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            showAutoError('Failed to delete FAQ. Please try again.');
        }
    };

    const handleEdit = (id) => {
        const faq = faqs.find((item) => item._id === id);
        if (faq) {
            setFormData({
                question: faq.question,
                answer: faq.answer,
            });
            setCurrentFaqId(id);
            setShow(true);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div>
                <Button variant="primary" onClick={handleShow} style={{ marginBottom: '10px' }}>
                    Add FAQ
                </Button>

                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentFaqId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formQuestion">
                                <Form.Label>Question</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your question"
                                    value={formData.question}
                                    onChange={handlePostData}
                                    name="question"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formAnswer">
                                <Form.Label>Answer</Form.Label>
                                <ReactQuill
    ref={quillRef}
    value={formData.answer}
    onChange={handleQuillChange}
    theme="snow"
    placeholder="Enter the answer"
/>
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="primary" type="submit">
                                    {currentFaqId ? 'Update' : 'Submit'}
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Row xs={1} sm={2} md={3} className="g-4">
                    {faqs.map((faq, index) => (
                        <Col key={faq._id}>
                            <Card style={{ height: '100%', borderRadius: '5px', backgroundColor: "#c5c5c5eb", color: "black" }}>
                                <Card.Body>
                                    <Card.Title>{`${index + 1}. ${faq.question}`}</Card.Title>
                                    {/* Render HTML for the answer */}
                                    <Card.Text dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                    <div className="d-flex">
                                        <Button onClick={() => handleEdit(faq._id)} style={{ backgroundColor: 'black', border: 'none', marginRight: '5px' }}>
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(faq._id)} style={{ backgroundColor: 'black', border: 'none' }}>
                                            <i className="bi bi-trash3"></i>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </DashboardLayout>
    );
}

export default Faq;



// import React, { useEffect, useRef, useState } from 'react';
// import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import styles for React Quill
// import axios from 'axios';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Swal from 'sweetalert2';

// function Faq() {
//     const [show, setShow] = useState(false);
//     const [formData, setFormData] = useState({
//         question: '',
//         answer: '',
//     });
//     const [faqs, setFaqs] = useState([]);
//     const [currentFaqId, setCurrentFaqId] = useState(null);

//     const quillRef = useRef(null);

//     const showAutoCloseAlert = (message) => {
//         Swal.fire({
//             position: "top-end",
//             icon: "success",
//             title: message,
//             showConfirmButton: false,
//             timer: 1500,
//         });
//     };

//     const showAutoError = (message) => {
//         Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: message,
//             showConfirmButton: false,
//             timer: 3000,
//         });
//     };

//     const fetchFaqs = async () => {
//         try {
//             const token = localStorage.getItem('admin_token');
//             const response = await axios.get('http://34.47.154.170/api/admin/faqs', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setFaqs(response.data);
//         } catch (error) {
//             console.error('Error fetching FAQs:', error);
//         }
//     };

//     useEffect(() => {
//         fetchFaqs();
//     }, []);

//     const handleShow = () => {
//         setShow(true);
//         setFormData({ question: '', answer: '' });
//         setCurrentFaqId(null);
//     };

//     const handleClose = () => setShow(false);

//     const handlePostData = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleQuillChange = (value) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             answer: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('admin_token');
//         const url = currentFaqId
//             ? `http://34.47.154.170/api/admin/faq/edit/${currentFaqId}`
//             : 'http://34.47.154.170/api/admin/faq/create';

//         try {
//             const response = await axios[currentFaqId ? 'put' : 'post'](url, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (currentFaqId) {
//                 setFaqs((prevFaqs) =>
//                     prevFaqs.map((faq) =>
//                         faq._id === currentFaqId ? { ...faq, ...formData } : faq
//                     )
//                 );
//             } else {
//                 setFaqs((prevFaqs) => [...prevFaqs, { _id: response.data._id, ...formData }]);
//             }
//             await fetchFaqs();
//             handleClose();
//         } catch (error) {
//             console.error('Error saving FAQ:', error.response ? error.response.data : error);
//             showAutoError('Failed to save FAQ. Please try again.');
//         }
//     };

//     const handleDelete = async (faqId) => {
//         const token = localStorage.getItem('admin_token');

//         try {
//             await axios.delete(`http://34.47.154.170/api/admin/faq/delete/${faqId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             await fetchFaqs();
//             setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== faqId));
//             showAutoCloseAlert('FAQ deleted successfully.');
//         } catch (error) {
//             console.error('Error deleting FAQ:', error);
//             showAutoError('Failed to delete FAQ. Please try again.');
//         }
//     };

//     const handleEdit = (id) => {
//         const faq = faqs.find((item) => item._id === id);
//         if (faq) {
//             setFormData({
//                 question: faq.question,
//                 answer: faq.answer,
//             });
//             setCurrentFaqId(id);
//             setShow(true);
//         }
//     };

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <div>
//                 <Button variant="primary" onClick={handleShow} style={{ marginBottom: '10px' }}>
//                     Add FAQ
//                 </Button>

//                 <Modal show={show} onHide={handleClose} centered>
//                     <Modal.Header closeButton>
//                         <Modal.Title>{currentFaqId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group controlId="formQuestion">
//                                 <Form.Label>Question</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Enter your question"
//                                     value={formData.question}
//                                     onChange={handlePostData}
//                                     name="question"
//                                     required
//                                 />
//                             </Form.Group>
//                             <Form.Group controlId="formAnswer">
//                                 <Form.Label>Answer</Form.Label>
//                                 <ReactQuill
//     ref={quillRef}
//     value={formData.answer}
//     onChange={handleQuillChange}
//     theme="snow"
//     placeholder="Enter the answer"
// />
//                             </Form.Group>
//                             <Modal.Footer>
//                                 <Button variant="primary" type="submit">
//                                     {currentFaqId ? 'Update' : 'Submit'}
//                                 </Button>
//                                 <Button variant="secondary" onClick={handleClose}>
//                                     Close
//                                 </Button>
//                             </Modal.Footer>
//                         </Form>
//                     </Modal.Body>
//                 </Modal>

//                 <Row xs={1} sm={2} md={3} className="g-4">
//                     {faqs.map((faq, index) => (
//                         <Col key={faq._id}>
//                             <Card style={{ height: '100%', borderRadius: '5px', backgroundColor: "#c5c5c5eb", color: "black" }}>
//                                 <Card.Body>
//                                     <Card.Title>{`${index + 1}. ${faq.question}`}</Card.Title>
//                                     {/* Render HTML for the answer */}
//                                     <Card.Text dangerouslySetInnerHTML={{ __html: faq.answer }} />
//                                     <div className="d-flex">
//                                         <Button onClick={() => handleEdit(faq._id)} style={{ backgroundColor: 'black', border: 'none', marginRight: '5px' }}>
//                                             <i className="bi bi-pencil-square"></i>
//                                         </Button>
//                                         <Button variant="danger" onClick={() => handleDelete(faq._id)} style={{ backgroundColor: 'black', border: 'none' }}>
//                                             <i className="bi bi-trash3"></i>
//                                         </Button>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     ))}
//                 </Row>
//             </div>
//         </DashboardLayout>
//     );
// }

// export default Faq;


