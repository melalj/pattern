import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';

import { UserDetails, LinkButton } from '.';
import { useItems, useUsers, useLink } from '../services';
import { UserType } from './types';

interface Props {
  user: UserType;
  removeButton: boolean;
  linkButton: boolean;
}

export default function UserCard(props: Props) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [token, setToken] = useState('');
  const [hovered, setHovered] = useState(false);
  //@ts-ignore
  const { itemsByUser, getItemsByUser } = useItems();
  const { deleteUserById } = useUsers();
  const { generateLinkToken, linkTokens } = useLink();

  // update data store with the user's items
  useEffect(() => {
    if (props.user.id) {
      getItemsByUser(props.user.id, true);
    }
  }, [getItemsByUser, props.user.id]);

  // update no of items from data store
  useEffect(() => {
    if (itemsByUser[props.user.id] != null) {
      setNumOfItems(itemsByUser[props.user.id].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, props.user.id]);

  // creates new link token upon change in user or number of items
  useEffect(() => {
    generateLinkToken(props.user.id, null); // itemId is null
  }, [props.user.id, numOfItems, generateLinkToken]);

  useEffect(() => {
    setToken(linkTokens.byUser[props.user.id]);
  }, [linkTokens, props.user.id, numOfItems]);

  const handleDeleteUser = () => {
    deleteUserById(props.user.id); // this will delete all items associated with a user
  };
  return (
    <div className="box user-card__box">
      <div className=" card user-card">
        <div
          className="hoverable"
          onMouseEnter={() => {
            if (numOfItems > 0) {
              setHovered(true);
            }
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
          <Touchable
            className="user-card-clickable"
            component={HashLink}
            to={`/user/${props.user.id}#itemCards`}
          >
            <div className="user-card__detail">
              <UserDetails
                hovered={hovered}
                user={props.user}
                numOfItems={numOfItems}
              />
            </div>
          </Touchable>
        </div>

        <div className="user-card__buttons">
          {token != null && token.length > 0 && props.linkButton && (
            <LinkButton userId={props.user.id} token={token} itemId={null}>
              Add a Bank
            </LinkButton>
          )}
          {props.removeButton && (
            <Button
              className="remove"
              onClick={handleDeleteUser}
              small
              inline
              centered
              secondary
            >
              Delete user
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
