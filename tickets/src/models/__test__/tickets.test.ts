import { Ticket } from "../tickets"

it('implements optimistic concurrency control',async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 4,
        userId : "123"
    });
    await ticket.save();
    
    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // makke two separate changes to the tickets we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});
    
    // save the first fetched ticket
    // expect it to work fine
    await firstInstance!.save();

    // save the second fetched ticket
    // this will give error as the version will be outdated, due to saving the first ticket
    // the ERROR -->  VersionError: No matching document found for id "658e7945e8e036d627f5934d" version 0 modifiedPaths "price"
    try {
        await secondInstance!.save();        
    } catch (error) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('Increaments the version number on multiple updates', async() => {
    const ticket = Ticket.build({
        title: "concert",
        price: 4,
        userId : "123"
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    // saving again and checking the version number
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
    await ticket.save();
    expect(ticket.version).toEqual(3);
})