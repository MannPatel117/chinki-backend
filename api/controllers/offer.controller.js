import { asyncHandler } from "../utils/asyncHandler.js";
import { Offer } from "../models/offers.model.js";
import { MasterProduct } from "../models/masterProduct.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addOffer = asyncHandler(async (req, res) => {
  const offer = req.body;
  const {
    offerName,
    minimumPrice,
    product,
    location,
    isActive
  } = req.body;
  let missingArray = [];
  for (const key in offer) {
    if (offer[key] === "" || offer[key] === null) {
      missingArray.push(key);
    }
  }
  if (missingArray.length !== 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, missingArray, "SOME FIELDS ARE MISSING"));
  } else {
    const offerExists = await Offer.findOne({
       offerName 
    });
    if (offerExists) {
      return res
        .status(409)
        .json(new ApiResponse(409, offerExists, "OFFER ALREADY EXISTS"));
    } else {
      const productSchema = await MasterProduct.findById(product);
      const offerCreated = await Offer.create({
        offerName,
        minimumPrice,
        product:productSchema,
        location,
        isActive
      });
      if (offerCreated) {
        return res
          .status(201)
          .json(
            new ApiResponse(201, offerCreated, "OFFER SUCCESSFULLY CREATED")
          );
      } else {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "Could not add offer, please try again later",
              "FAILED TO ADD OFFER"
            )
          );
      }
    }
  }
});

const editOffer = asyncHandler(async (req, res) => {
  const offer = req.body;
  let id= offer?._id;
  delete offer._id;
  const updatedOffer = await Offer.findByIdAndUpdate(
    id,
    {
        $set: offer
    },
    {
        new: true
    }
  )
  return res
        .status(200)
        .json(
          new ApiResponse(200, updatedOffer, "OFFER SUCCESSFULLY UPDATED")
        );
});

const getOffersbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const offerfound = await Offer.findById(
      id
    )
    if(offerfound){
        return res
          .status(200)
          .json(
            new ApiResponse(200, offerfound, "OFFER FOUND")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });
  const getAllOffers = asyncHandler(async (req, res) => {
    const activeOffers = await Offer.find();
    if(activeOffers){
        return res
          .status(200)
          .json(
            new ApiResponse(200, activeOffers, "OFFERS FOUND")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });

  const deleteOfferbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const deleteOffer = await Offer.findByIdAndDelete(
      id
    )
    if(deleteOffer){
        return res
          .status(200)
          .json(
            new ApiResponse(200, "Offer successfully deleted", "OFFER DELETED")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });
  const addBillinOffer = asyncHandler(async (req, res) => {
    const appliedOffer = req.body;
    let id = req.body._id;
    let billId = req.body.billNo;
    const offerfound = await Offer.findById(id)
    if(offerfound){
        let tempArr = offerfound.appliedonBill;
        tempArr.push(billId)
        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            {
                $set: {
                    appliedonBill:tempArr
                }    
            },{
                new: true
            }
        )
        if(updatedOffer){
            return res
          .status(200)
          .json(
            new ApiResponse(200, updatedOffer, "BILLNO SUCCESSFULLY ADDED")
          );
        }
        else{
            return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
        );
        }
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    );
    }
  });

  const getAllActiveOffers = asyncHandler(async (req, res) => {
    const activeOffers = await Offer.find({ isActive: true });
    if(activeOffers){
        return res
          .status(200)
          .json(
            new ApiResponse(200, activeOffers, "OFFERS FOUND")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });

export { addOffer, editOffer, getOffersbyID, getAllOffers, deleteOfferbyID, addBillinOffer, getAllActiveOffers };

