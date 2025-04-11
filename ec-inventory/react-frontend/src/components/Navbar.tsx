import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

type NavbarProps = {
  onCategoryChange: (category: string) => void;
};

function SiteNavbar({ onCategoryChange }: NavbarProps) {
  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Navbar.Brand href="#">EC Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {/* カテゴリ変更: All / 食べ物 / 飲み物 */}
            <Nav.Link onClick={() => onCategoryChange('All')}>All</Nav.Link>
            <Nav.Link onClick={() => onCategoryChange('food')}>食べ物</Nav.Link>
            <Nav.Link onClick={() => onCategoryChange('drink')}>飲み物</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteNavbar;
