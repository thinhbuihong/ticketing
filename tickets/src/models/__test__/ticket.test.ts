import Ticket from "../ticket";

it("implements optimictis concurrentcy control (OCC)", async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 4,
    userId: "userid",
  });

  //save the ticket to the database
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separate changes to the tickets we fetched
  firstInstance?.set({ price: 40 });
  secondInstance?.set({ price: 99 });

  //save the first fetched ticket
  await firstInstance?.save();

  //save the second fetched ticket and expect an error
  try {
    await secondInstance?.save();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});

it("increaments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 4,
    userId: "userid",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
