import Incident from "../models/incident.model.js";
import SOS from "../models/sos.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDashboardStat = asyncHandler(async (req, res) => {
    const total_sos_requests = await SOS.countDocuments();
    const resolved_sos = await SOS.countDocuments({
        status: "resolved",
    });
    const pending_sos = total_sos_requests - resolved_sos;

    const total_incidents = await Incident.countDocuments();
    const resolved_incidents = await Incident.countDocuments({
        status: "resolved",
    });
    const inProgress_incidents = total_incidents - resolved_incidents;

    res.status(200).json(
        new ApiResponse(
            200,
            {
                total_sos_requests,
                resolved_sos,
                pending_sos,
                total_incidents,
                resolved_incidents,
                inProgress_incidents,
            },
            "All Stats"
        )
    );
});

const getRecentSOSAlearts = asyncHandler(async (req, res) => {
    const sosAlerts = await SOS.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json(new ApiResponse(200, sosAlerts));
});

export { getDashboardStat, getRecentSOSAlearts };
