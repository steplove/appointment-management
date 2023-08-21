import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../constants/constants";

function Test() {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "/api/readProvince")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    fetch(BASE_URL + `/api/readAmphures?provinceName=${provinceId}`)
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    fetch(BASE_URL + `/api/readDistricts?amphureId=${districtId}`)
      .then((response) => response.json())
      .then((data) => setSubdistricts(data))
      .catch((error) => console.error("Error fetching subdistricts:", error));
      console.log(selectedDistrict);
  };

  const handleSubdistrictChange = (subdistrictId) => {
    setSelectedSubdistrict(subdistrictId);
    fetch(BASE_URL + `/api/readPostalCodes?amphureId=${subdistrictId}`)
      .then((response) => response.json())
      .then((data) => setPostalCode(data))
      .catch((error) => console.error("Error fetching postal code:", error));
      console.log(selectedSubdistrict);

  };
  return (
    <Container>
      <h2>Edit Information</h2>
      <Form>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Province:</Form.Label>
              <Form.Control
                as="select"
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name_th}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>District:</Form.Label>
              <Form.Control
                as="select"
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name_th}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Subdistrict:</Form.Label>
              <Form.Control
                as="select"
                value={selectedSubdistrict}
                onChange={(e) => handleSubdistrictChange(e.target.value)}
              >
                <option value="">Select Subdistrict</option>
                {subdistricts.map((subdistrict) => (
                  <option key={subdistrict.id} value={subdistrict.id}>
                    {subdistrict.name_th}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Postal Code:</Form.Label>
              <Form.Control type="text" value={postalCode} readOnly />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary">Save Changes</Button>
      </Form>
    </Container>
  );
}

export default Test;
