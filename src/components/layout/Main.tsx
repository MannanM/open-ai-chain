import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown, NavItem, Row } from "react-bootstrap";
import { Link } from "gatsby";

type MainProps = {
    children: React.ReactNode,
}

export const Main = ({children}: MainProps) => {
    return <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">
                    Open AI Chain
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavItem>
                            <Link className="nav-link navigation__navlinks"
                                  to={'/'}>
                                Home
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link className="nav-link navigation__navlinks"
                                  to={'/about'}>
                                About
                            </Link>
                        </NavItem>
                        <NavDropdown title="Examples" id="basic-nav-dropdown">

                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to={'/examples/Colombia'}>Colombian Food</Link>
                            </NavDropdown.Item>
                            {/*<NavDropdown.Divider/>*/}
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavItem>
                            <Button href='https://github.com/MannanM/open-ai-chain' variant="outline-success">
                                View on GitHub
                            </Button>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Container>
            {children}
        </Container>
    </>;
}