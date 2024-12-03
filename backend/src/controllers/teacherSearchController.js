import TeacherForm from '../model/teacherFormSchema.js';
import { dijkstra } from '../utils/dijkstra.js';

const calculateDistance = (location1, location2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (location2.latitude - location1.latitude) * Math.PI / 180;
    const dLon = (location2.longitude - location1.longitude) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(location1.latitude * Math.PI / 180) * Math.cos(location2.latitude * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const searchTeachers = async (req, res) => {
    const { level, subject, minPrice, maxPrice, studentLocation } = req.query;

    const lowerLevel = level ? Number(level) : null; // Convert level to a number
    const lowerSubject = subject ? subject.toLowerCase() : null;

    try {
        // Check for required studentLocation
        if (!studentLocation) {
            return res.status(400).json({ success: false, message: 'Student location is required' });
        }

        // Parse studentLocation from query
        let parsedLocation;
        try {
            parsedLocation = JSON.parse(studentLocation);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid student location format. Ensure it is a valid JSON object.' });
        }

        const { latitude, longitude } = parsedLocation;
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ success: false, message: 'Latitude and longitude must be valid numbers.' });
        }

        // Build the query based on search parameters
        const query = {};

        // Ensure that the combination of level, subject, and price matches in the same subject object
        if (lowerLevel || lowerSubject || minPrice || maxPrice) {
            const subjectConditions = {};

            // Add level condition - must be an exact match
            if (lowerLevel) {
                subjectConditions.level = lowerLevel; // Exact level match
            }
            // Add subject condition - must be an exact match
            if (lowerSubject) {
                subjectConditions.subject = lowerSubject; // Exact subject match
            }
            // Add price condition
            if (minPrice || maxPrice) {
                subjectConditions.price = {};
                if (minPrice) subjectConditions.price.$gte = Number(minPrice);
                if (maxPrice) subjectConditions.price.$lte = Number(maxPrice);
            }

            // Ensure exact match for level, subject, and price within the same subject object
            query['subjectsOffered'] = { $elemMatch: subjectConditions };
        }

        // Fetch teachers matching the search criteria
        const teachers = await TeacherForm.find(query).lean();

        if (!teachers.length) {
            return res.status(200).json({
                success: true,
                message: 'No teachers found matching the criteria',
                teachers: []
            });
        }

        // Build a graph for Dijkstra's algorithm
        const graph = {};
        const studentKey = `student_${latitude}_${longitude}`; // Unique key for the student location
        graph[studentKey] = {};

        // Calculate distances from the student to each teacher
        teachers.forEach(teacher => {
            const teacherLocation = teacher.location || {};
            const teacherKey = `teacher_${teacher._id}`; // Unique key for each teacher
            const distance = calculateDistance(parsedLocation, teacherLocation);
            graph[studentKey][teacherKey] = distance; // Connect student location to teacher
            graph[teacherKey] = {}; // Initialize the teacher's node in the graph
        });

        // Run Dijkstra's algorithm from the student's location
        const shortestPaths = dijkstra(graph, studentKey);

        // Prepare the response data
        const sortedTeachers = teachers.map(teacher => {
            const teacherKey = `teacher_${teacher._id}`;
            return {
                ...teacher,
                distance: shortestPaths[teacherKey] || Infinity // Include distance in the response
            };
        }).sort((a, b) => a.distance - b.distance);

        // Get nearest and farthest teachers (optional)
        const nearestTeacher = sortedTeachers[0];
        const farthestTeacher = sortedTeachers[sortedTeachers.length - 1];

        res.status(200).json({
            success: true,
            nearestTeacher,
            farthestTeacher,
            teachers: sortedTeachers, // Return sorted list of teachers
        });
    } catch (error) {
        console.error('Error searching for teachers:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
