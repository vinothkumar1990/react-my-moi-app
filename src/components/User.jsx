import React from 'react';
import { Commet } from 'react-loading-indicators';
import useFetch from './custom-hook/useFetch';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const User = () => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useFetch(
    "https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois"
  );

  // Delete function with SweetAlert confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois/${id}`)
          .then(() => {
            const newProductList = products.filter(product => product.id !== id);
            setProducts(newProductList);

            Swal.fire("Deleted!", "Your record has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong while deleting.", "error");
          });
      }
    });
  };

  // Navigate to Edit page
  const handleEdit = (id) => {
    navigate(`/update_moi/${id}`);
  };

  // Calculate totals
  const totalOldAmount = products.reduce((sum, item) => sum + Number(item.old_amount), 0);
  const totalNewAmount = products.reduce((sum, item) => sum + Number(item.new_amount), 0);

  // Table styles
  const thStyle = { padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center', color: 'white' };
  const tdStyle = { padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' };
  const tdTotalStyle = { padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', color: '#39740c', fontWeight: 'bold' };

  if (isLoading) {
    return (
      <div>
        <center>
          <Commet color="#32cd32" size="medium" text="loading" textColor="" />
        </center>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px' }}>
      <article style={{ marginBottom: '20px' }}>
        <span style={{ color: '#163b16ff', fontWeight: 'bold', fontSize: '18px' }}>Create New Moi</span>
        <button onClick={() => navigate("/newMoi")} className="btn btn-primary" style={{ marginLeft: '10px' }}>
          Click me
        </button>
      </article>

      <div style={{ overflowX: 'auto' }}>
        <table width="100%" border="1" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0275d8' }}>
              <th style={thStyle}>ஊர்</th>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>பழைய பணம்</th>
              <th style={thStyle}>புதிய பணம்</th>
              <th style={thStyle}>தடவை</th>
              <th style={thStyle}>திருமண விழா</th>
              <th style={thStyle}></th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f7d4e7' : '#e2e2e2'
                }}
              >
                <td style={tdStyle}>{item.place}</td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.old_amount}</td>
                <td style={tdStyle}>{item.new_amount}</td>
                <td style={tdStyle}>{item.given_amount_status}</td>
                <td style={tdStyle}>{item.function_name}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="btn btn-primary btn-sm"
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  </td>
                  <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Totals Row */}
            <tr style={{ backgroundColor: '#d1ecf1' }}>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}>மொத்தம் பழைய பணம்: {totalOldAmount}</td>
              <td style={tdTotalStyle}>மொத்தம் புதிய பணம்: {totalNewAmount}</td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
