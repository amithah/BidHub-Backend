// cronJobs.js
const cron = require('node-cron');
const Auction = require('./models/Auction'); // Adjust the path to your Auction model
const AUCTION_STATUS =require('./constants/Auction')
const updateAuctionStatus = async () => {
  // console.log('Running cron job to update auction status');
  const currentTime = new Date().getTime();

  try {
    const auctions = await Auction.find({});

    auctions.forEach(async (auction) => {
      const startTime = new Date(auction.startTime).getTime();
      const endTime = startTime + auction.duration;

      if (currentTime >= startTime && currentTime < endTime && auction.status !== 'Ongoing') {
        auction.status = 'Ongoing';
      } else if (currentTime >= endTime && auction.status !== 'Finished') {
        auction.status = 'Finished';
      } else if (currentTime < startTime && auction.status !== 'Upcoming') {
        auction.status = 'Upcoming';
      }

      await auction.save();
    });
  } catch (error) {
    console.error('Error updating auction status:', error);
  }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', updateAuctionStatus);

module.exports = {
  updateAuctionStatus,
};
