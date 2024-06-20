import { Request, Response } from 'express';
import Place from '../models/Place';
import { ObjectId } from 'mongodb';

const getPlace = async (req: Request, res: Response) => {
    try {
        const placeId = req.body.id;

        const placeDetails = await Place.aggregate([
            { $match: { _id: new ObjectId(placeId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    let: { placeId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$placeId', '$$placeId'] },
                                customerRating: { $exists: true, $ne: null },
                                customerReview: { $exists: true, $ne: null }
                            }
                        },
                        {
                            $group: {
                                _id: '$placeId',
                                averageCustomerRating: { $avg: '$customerRating' },
                                totalReviewCount: { $sum: 1 }
                            }
                        }
                    ],
                    as: 'reviewStats'
                }
            },
            {
                $unwind: { path: '$reviewStats', preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'reviews',
                    let: { placeId: '$_id' },
                    pipeline: [
                        {
                            $match: { 
                                $expr: { $eq: ['$placeId', '$$placeId'] },
                                customerRating: { $exists: true, $ne: null },
                                customerReview: { $exists: true, $ne: null }
                            }
                        },
                        { $limit: 100 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'customerId',
                                foreignField: '_id',
                                as: 'customerDetails'
                            }
                        },
                        {
                            $unwind: {
                                path: '$customerDetails',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ],
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    averageCustomerRating: {
                        $toInt: {
                            $trunc: ["$reviewStats.averageCustomerRating", 0]
                        }
                    },
                    totalReviewCount: "$reviewStats.totalReviewCount"
                }
            }
        ]);

        if (placeDetails.length === 0) {
            return res.status(404).json({ message: "Place not found" });
        }

        const place = placeDetails[0];

        res.status(200).json({ message: "Place fetched successfully", place });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the place" });
    }
};

export default {
    getPlace
};