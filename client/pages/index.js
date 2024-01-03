import Link from "next/link";

const landingPage = ({ currentUser, tickets }) => {
  console.log(tickets);
  return (
    <div className="container">
      <h1 className="font-heavy text-[72px]">Tickets</h1>
      <ul role="list" className="divide-y divide-gray-100">
        {tickets.map((ticket, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {ticket.title}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {ticket.price}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// getInitialProps, if we want to fetch some data during server side rendering process, we can use this function
// here context === {req,res}
landingPage.getInitialProps = async (context, client, currentUser) => {
  //URL is made to reach out to ingress-nginx, Watch videos from 230
  // const client = buildClient(context);
  // try {
  //     const { data } = await client.get('/api/users/currentUser');
  //     return data;
  // } catch (error) {
  //     console.error('Error fetching currentUser:', error.message);
  //     return { currentUser: null };
  // }

  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default landingPage;
