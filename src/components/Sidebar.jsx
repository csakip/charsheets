import { Dropdown, Nav, OverlayTrigger, Tooltip, NavItem, NavLink } from "react-bootstrap";
import { Calendar3, EnvelopeFill, BoxArrowRight, House, PeopleFill } from "react-bootstrap-icons";
import { signOut } from "../supabaseClient";
import React from "react";
import { useSimpleDialog } from "./SimpleDialog";

const Sidebar = () => {
  const { openModal, SimpleDialog } = useSimpleDialog();
  const renderTooltip = (props, content) => (
    <Tooltip id={`tooltip-${content}`} {...props}>
      {content}
    </Tooltip>
  );

  function SidebarItem({ icon, tooltip, hasContextMenu, onClick }) {
    const wrappedContent = (
      <OverlayTrigger
        placement='right'
        delay={{ show: 500, hide: 100 }}
        overlay={(props) => renderTooltip(props, tooltip)}>
        {React.cloneElement(icon, { size: 20 })}
      </OverlayTrigger>
    );

    if (hasContextMenu) {
      return (
        <Dropdown as={NavItem} drop='end'>
          <Dropdown.Toggle as={NavLink}>{wrappedContent}</Dropdown.Toggle>
          <Dropdown.Menu style={{ marginLeft: "-10px" }}>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
            <Dropdown.Item>Option 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Nav.Item>
        <Nav.Link eventKey='link-2' onClick={onClick}>
          {wrappedContent}
        </Nav.Link>
      </Nav.Item>
    );
  }

  return (
    <>
      <Nav className='flex-column sidebar'>
        <SidebarItem icon={<House />} tooltip='Home' />
        <SidebarItem icon={<EnvelopeFill />} tooltip='Messages' hasContextMenu={true} />
        <SidebarItem icon={<PeopleFill />} tooltip='Users' />
        <SidebarItem icon={<Calendar3 />} tooltip='Calendar' hasContextMenu={true} />
        <SidebarItem
          icon={<BoxArrowRight />}
          tooltip='Log out'
          onClick={() => {
            openModal({
              title: "Log out",
              body: "Are you sure you want to log out?",
              cancelButton: "Cancel",
              cancelButtonVariant: "dark",
              onClose: (ret) => {
                if (ret) signOut();
              },
            });
          }}
        />
      </Nav>
      <SimpleDialog />
    </>
  );
};

export default Sidebar;
