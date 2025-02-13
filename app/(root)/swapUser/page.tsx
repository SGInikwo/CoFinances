import UserBox from '@/components/UserBox';
import { getAllUsers, getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react';

const Swap = async () => {
  const loggedIn = await getLoggedInUser();
  const users = await getAllUsers();

  // Separate your name from the list
  const otherUsers = users.filter(
    (user) => user.firstName !== loggedIn.firstName,
  );

  // Add your name at the start of the list
  const sortedUsers = [
    ...users.filter((user) => user.firstName === loggedIn.firstName), // Your name
    ...otherUsers, // All other users
  ];

  // console.log(sortedUsers);

  // console.log('The found users', users);
  return (
    <section className="home">
      {loggedIn.isSwapped === 1 ? 'Swapped' : null}
      <div className="home-content">
        {otherUsers.map((user) =>
          loggedIn.isSwapped === 0 || loggedIn.fromSwapId === user.firstName ? (
            <UserBox user={loggedIn} key={user.userId} swapUser={user} />
          ) : null,
        )}
      </div>
    </section>
  );
};

export default Swap;
