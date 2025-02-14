import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Modal, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import '../usertranstion/usertransation.css'; // Import custom CSS
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';

function Usertransation() {
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle error state
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedPlayers, setSelectedPlayers] = useState([]); // State to store selected players data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of items per page

  const [searchTerm, setSearchTerm] = useState("");
const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "descending" });

const handleSort = (key) => {
  let direction = "ascending";
  if (sortConfig.key === key && sortConfig.direction === "ascending") {
    direction = "descending";
  }
  setSortConfig({ key, direction });
};

const sortedItems = [...transactions].sort((a, b) => {
  let aValue, bValue;

  // Handle sorting based on column key
  if (sortConfig.key === "name") {
    aValue = a.user_data.name.toLowerCase();
    bValue = b.user_data.name.toLowerCase();
  } else if (sortConfig.key === "email") {
    aValue = a.user_data.email.toLowerCase();
    bValue = b.user_data.email.toLowerCase();
  } else {
    aValue = new Date(a.updatedAt).getTime();
    bValue = new Date(b.updatedAt).getTime();
  }

  if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
  if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
  return 0;
});

const filteredItems = sortedItems.filter((transaction) => {
  const name = transaction.user_data.name.toLowerCase();
  const email = transaction.user_data.email.toLowerCase();
  const timestamp = new Date(transaction.updatedAt).toLocaleDateString();
  const searchLower = searchTerm.toLowerCase();

  return (
    name.includes(searchLower) ||
    email.includes(searchLower) ||
    timestamp.includes(searchLower)
  );
});



  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("admin_token"); // Get the admin token from local storage
      const response = await axios.get("http://34.47.154.170/api/admin/usertransation", {
        headers: { Authorization: `Bearer ${token}` }, // Pass the admin token in the header
      });

      // Check if the response is successful and set the transactions state
      if (response.data.status) {
        setTransactions(response.data.transactions);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to handle View button click
  const handleViewPlayers = (players) => {
    setSelectedPlayers(players); // Set the selected players for the modal
    setShowModal(true); // Show the modal
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  // Calculate current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox display="flex" justifyContent="flex-end" >
        <SoftInput
          placeholder="Search here"
          icon={{ component: "search", direction: "left" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SoftBox>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {sortConfig.key === "email" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th>Opening Credits</th>
            <th>Closing Credits</th>
            <th>Total Credits</th>
            <th onClick={() => handleSort("updatedAt")} style={{ cursor: "pointer" }}>
              Time Stamp{" "}
              {sortConfig.key === "updatedAt" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.user_data.name}</td>
              <td>{transaction.user_data.email}</td>
              <td>{Number(transaction.opening_credits).toFixed(2)}</td>
              <td>{Number(transaction.closing_credits).toFixed(2)}</td>
              <td>{Number(transaction.total_credits).toFixed(2)}</td>
              <td>{new Date(transaction.updatedAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleViewPlayers(transaction.players_data)}
                >
                  <i className="bi bi-eye"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
          <footer className="mt-4">
            <Row className="align-items-center">
              <Col xs={12} md={6} className="mb-2 mb-md-0">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, transactions.length)} of {transactions.length} entries
                </span>
              </Col>
              <Col xs={12} md={6} className="text-md-end">
                <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} variant="secondary" className="me-2">
                  <i className="bi bi-caret-left"></i>
                </Button>
                <span style={{ margin: '0 10px' }}>{currentPage}</span>
                <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= transactions.length} variant="secondary">
                  <i className="bi bi-caret-right"></i>
                </Button>
              </Col>
            </Row>
          </footer>
        </>
      )}

      {/* Modal to display player details */}
      {/* <Modal show={showModal} onHide={handleCloseModal} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Player Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scroll">
          {selectedPlayers.length > 0 ? (
            <Table striped bordered hover >
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Profile Image</th>
                  <th>Value</th>
                  <th>Share Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedPlayers.map((player) => (
                  <tr key={player.player_id}>
                    <td>{player.name}</td>
                    <td>
                      <img
                        src={`http://34.47.154.170/api/images/${player.profile_image}`}
                        alt={player.name}
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    </td>
                    <td>{player.value}</td>
                    <td>{player.share_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No player details available.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
<Modal show={showModal} onHide={handleCloseModal} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Player Details</Modal.Title>
  </Modal.Header>
  <Modal.Body className="modal-body-scroll">
    {selectedPlayers.length > 0 ? (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Profile Image</th>
            <th>Value</th>
            <th>Share Quantity</th>
            {/* Conditionally render extra columns based on player type */}
            {(selectedPlayers.some(player => player.type === 'sell' || player.type === 'remove' || player.type === 'buy')) && (
              <>
                <th>Sell Share Quantity</th>
                <th>Profit / Loss</th>
                <th>Type</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {selectedPlayers.map((player) => (
            <tr key={player.player_id}>
              <td>{player.name}</td>
              <td>
                <img
                  src={`http://34.47.154.170/api/images/${player.profile_image}`}
                  alt={player.name}
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              </td>
              <td>{player.value}</td>
              <td>{player.original_share_quantity || player.share_quantity}</td>

              {/* Conditionally render table rows based on player type */}
              {(player.type === 'sell' || player.type === 'remove' || player.type === 'buy') && (
                <>
                  <td>{player.sell_share_quantity}</td>
                  <td>{player.profit_loss}</td>
                  <td>{player.type}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <Alert variant="info">No player details available.</Alert>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </DashboardLayout>
  );
}

export default Usertransation;
