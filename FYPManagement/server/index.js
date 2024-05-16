const express= require("express")
const mongoose= require("mongoose")
const app=express()
const cors=require('cors')
const router=express.Router();
const Supervisor= require('./models/Supervisor')
const CommitteeMember= require('./models/CommitteeMember')
const Faculty= require('./models/Faculty')
const Project= require('./models/Project')
const Panel= require('./models/Panel')
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const corsOptions = {
  origin: 'http://localhost:3000', // Replace this with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
const secretKey = '2111624'; // Replace 'your_secret_key_here' with your actual secret key

const Student = require('./models/Student')
mongoose.connect("mongodb+srv://Ahmed:2111624@cluster0.pgojppv.mongodb.net/FYPMS?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
 console.log('Connected to MongoDB');}).catch(console.log("Not Connected"))

 app.post('/login', async (req, res) => {
  try {
    
    const { name, password, role } = req.body;

    // Check if the required fields are provided
    if (!name || !password || !role) {
      return res.status(400).json({ message: 'Missing name, password, or role in request body' });
    }

    // Determine which model to use based on the selected role
    let User;
    switch (role.toLowerCase()) { // Update to lowercase for consistency
      case 'students':
        User = Student;
        break;
      case 'committee member': // Adjusted role name
        User = CommitteeMember; // Updated model name
        break;
      case 'supervisor':
        User = Faculty; // Updated model name
        break;
      case 'panel member': // Adjusted role name
        User = Faculty; // Assuming this is the model name for panel members
        break;
      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Find the user by name
    const user = await User.findOne({ name });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid2 = password===user.password ? true : false;
    if (!isPasswordValid && ! isPasswordValid2) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, secretKey, { expiresIn: '1h' });
    // Return the token and user data with success status
    res.json({ success: true, token, id: user._id, role }); // Include user role in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//getting username
app.get('/get-username', async (req, res) => {
  try {
    const id = req.query.id;

    // Find user by ID
    const user = await Student.findById(id);
    console.log(user)
    // Check if user exists
    if (!user) {
      console.log("user kidher hai?")
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the username to the frontend
    res.json({ username: user.name });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//module.exports = router;
// view supervisor name for student
app.get('/get-supervisor-name', async (req, res) => {
  try {
      // Extract student ID from the request query parameters
      const studentId = req.query.id;

      // Find the student by ID
      const student = await Student.findById(studentId);

      // Check if the student exists
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      // Retrieve the project ID from the student's project title
      const projectId = student.projectTitle;

      // Find the project by ID
      const project = await Project.findById(projectId);

      // Check if the project exists
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      // Retrieve the supervisor ID from the project
      const supervisorId = project.supervisor;
      // Find the supervisor in the faculty table by ID
      const supervisor = await Faculty.findById(supervisorId);

      // Check if the supervisor exists
      if (!supervisor) {
          return res.status(404).json({ message: 'Supervisor not found' });
      }

      // Return the supervisor's name to the frontend
      res.json({ supervisorName: supervisor.name });
  } catch (error) {
      console.error('Error fetching supervisor name:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
//api to get project title for students
app.get('/get-project-details', async (req, res) => {
  try {
    const id = req.query.id;

    // Find user by ID
    const user = await Student.findById(id);
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find project details by project title
    const project = await Project.findById(user.projectTitle);

    // Return the project title and description to the frontend
    res.json({ projectTitle: project.title, projectDescription: project.description });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//api for getting group members of students
let cachedGroupMembers = null;

app.get('/group-members', async (req, res) => {
  try {
    // Check if group members are already cached
    if (cachedGroupMembers) {
      return res.json({ groupMembers: cachedGroupMembers });
    }

    const studentId = req.query.id;

    // Retrieve the student's information from the database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const groupMemberIds = student.groupMembers;

    // Fetch group members' information from the database
    const groupMembers = await Promise.all(groupMemberIds.map(async memberId => {
      const groupMember = await Student.findById(memberId);
      if (groupMember) {
        return {
          name: groupMember.name,
          email: groupMember.email
        };
      }
      return null;
    }));

    // Cache the group members for future requests
    cachedGroupMembers = groupMembers;
    console.log({groupMembers})
    res.json({ groupMembers });
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// register students
app.post('/register', async (req, res) => {
  try {
      console.log("kia hai?")
      // Extract name, email, and password from the request body
      const { name, email, password } = req.body;

      // Create a new student document
      const newStudent = new Student({
          name,
          email,
          password
      });

      // Save the new student to the database
      await newStudent.save();

      // Return success message
      res.json({ success: true });
  } catch (error) {
      // Return an error message if any error occurs
      console.error('Error registering student:', error);
      res.status(500).json({ success: false, message: 'Failed to register student' });
  }
});
// register project
app.post('/add-project', async (req, res) => {
    try {
        // Extract project title and description from the request body
        const { title, description } = req.body;

        // Create a new project document
        const newProject = new Project({
            title,
            description
        });

        // Save the new project to the database
        await newProject.save();

        // Return success message
        res.json({ success: true });
    } catch (error) {
        // Return an error message if any error occurs
        console.error('Error adding project:', error);
        res.status(500).json({ success: false, message: 'Failed to add project' });
    }
});
// get all projects details
app.get('/projects', async (req, res) => {
  try {
      // Fetch all projects from the database
      const projects = await Project.find();

      // Iterate through each project and fetch related information
      const projectsWithDetails = await Promise.all(projects.map(async (project) => {
          // Find students assigned to this project
          const students = await Student.find({ projectTitle: project._id, projectTitle: { $ne: null } });


          // Find supervisor of this project
          const supervisor = await Faculty.findOne({ _id: project.supervisor, role: 'Supervisor', _id: {$ne:null} });

          // Return project details along with students and supervisor
          return {
              title: project.title,
              description: project.description,
              students: students.map(student => ({ name: student.name, email: student.email })),
              supervisor: { name: supervisor.name, email: supervisor.email }
          };
      }));

      // Return the projects with details to the frontend
      res.json({ projects: projectsWithDetails });
  } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// find panel members
app.get('/panel-members', async (req, res) => {
  try {
      // Extract student ID from the request query parameters
      const studentId = req.query.id;

      // Find the student by ID
      const student = await Student.findById(studentId);

      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      // Get the project ID associated with the student
      const projectId = student.projectTitle;

      // Find the project by ID to get the panel ID
      const project = await Project.findById(projectId);

      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      // Get the panel ID from the project
      const panel = project.panel;
      const some = await Panel.findById(panel);
      // Extract member IDs from panel.members array
      const memberIds = some.members;
      // Find all faculty members associated with the panel members' IDs
      const panelMembers = await Faculty.find({ _id: { $in: memberIds } });

      res.json({ panelMembers });
  } catch (error) {
      console.error('Error fetching panel members:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// get ungrouped members
app.get('/unassigned-students', async (req, res) => {
  try {
    // Query the database to find students whose groupMembers field is empty
    const unassignedStudents = await Student.find({
      $or: [
        { groupMembers: { $exists: false } }, // Students with no groupMembers field
        { groupMembers: { $size: 0 } } // Students with an empty array in groupMembers
      ]
    });

    // Return the list of unassigned students to the frontend
    res.json({ unassignedStudents });
  } catch (error) {
    console.error('Error fetching unassigned students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// assign group members
app.post('/assign-group-members', async (req, res) => {
  try {
      console.log("mai aa gaya")
      // Receive student IDs of the three selected students from the frontend
      
      const { student1Id, student2Id, student3Id } = req.body;
      console.log(student1Id,student2Id,student3Id);
      // Fetch the student documents from the database based on the provided IDs
      const student1 = await Student.findById(student1Id);
      const student2 = await Student.findById(student2Id);
      const student3 = await Student.findById(student3Id);
      // Check if all students exist in the database
      if (!student1 || !student2 || !student3) {
          return res.status(404).json({ success: false, message: 'One or more students not found' });
      }

      // Assign group members to the third student
      student3.groupMembers = [student1._id, student2._id];
      student2.groupMembers = [student1._id, student3._id];
      student1.groupMembers = [student3._id, student2._id];

      // Save the updated student document to the database
      await student3.save();
      await student2.save();
      await student1.save();

      // Return success response to the frontend
      res.json({ success: true, message: 'Group members assigned successfully' });
  } catch (error) {
      console.error('Error assigning group members:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
//get students who are project less
app.get('/unassigned-students-projects', async (req, res) => {
  try {
      // Find students where the projectTitle field is null or undefined
      const unassignedStudents = await Student.find({ projectTitle: { $exists: false } });

      // Return the list of unassigned students to the frontend
      res.json({ unassignedStudents });
  } catch (error) {
      console.error('Error fetching unassigned students:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// projects without supervisor
app.get('/projects-without-supervisor', async (req, res) => {
  try {
      // Find projects where the supervisor field is null or undefined
      const projectsWithoutSupervisor = await Project.find({ supervisor: { $exists: false } });

      // Return the list of projects without supervisor to the frontend
      res.json({ projectsWithoutSupervisor });
  } catch (error) {
      console.error('Error fetching projects without supervisor:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
//supervisor with fyps<6
app.get('/supervisors-with-limited-fyps', async (req, res) => {
  try {
      // Find supervisors with maxFYPs less than 6
      const supervisors = await Supervisor.find({ maxFYPs: { $lt: 6 } });
      // Extract IDs of these supervisors
      const supervisorIds = supervisors.map(supervisor => supervisor.supervisorId);
      // Find corresponding faculty members in the Faculty table
      const facultyMembers = await Faculty.find({ _id: { $in: supervisorIds } });

      // Return the list of faculty members to the frontend
      res.json({ facultyMembers });
  } catch (error) {
      console.error('Error fetching supervisors with limited maxFYPs:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// assign supervisor to project
app.post('/assign-supervisor-to-project', async (req, res) => {
  try {
      // Receive supervisor ID and project ID from the frontend
      let { supervisorId, projectId } = req.body;
      console.log({supervisorId, projectId});
      // Find the project by ID
      const project = await Project.findById(projectId);

      // Check if the project exists
      if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Find the supervisor by ID
      const supervisor = await Faculty.findOne({name: supervisorId});
      console.log(supervisor)
      supervisorId= supervisor._id;
      // Check if the supervisor exists
      if (!supervisor) {
          return res.status(404).json({ success: false, message: 'Supervisor not found' });
      }
      // Assign the supervisor to the project
      project.supervisor = supervisorId;

      // Save the updated project to the database
      await project.save();

      // Return success response to the frontend
      res.json({ success: true, message: 'Supervisor assigned to project successfully' });
  } catch (error) {
      console.error('Error assigning supervisor to project:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
//increment MaxFyps of a supervisor
app.put('/increment-maxFYPs', async (req, res) => {
  try {
      // Receive supervisor ID from the frontend
      const { supervisorId } = req.body;

      // Find the supervisor by ID
      const supervisor = await Supervisor.findById(supervisorId);

      // Check if the supervisor exists
      if (!supervisor) {
          return res.status(404).json({ success: false, message: 'Supervisor not found' });
      }

      // Increment the maxFYPs number by 1
      supervisor.maxFYPs += 1;

      // Save the updated supervisor to the database
      await supervisor.save();

      // Return success response to the frontend
      res.json({ success: true, message: 'maxFYPs incremented successfully' });
  } catch (error) {
      console.error('Error incrementing maxFYPs:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// faculty without role
app.get('/unassigned-faculty', async (req, res) => {
  try {
    // Find all faculty members who do not have a role assigned yet
    const unassignedFaculty = await Faculty.find({ role: { $exists: false } });

    // Send the unassigned faculty members as the response
    console.log(unassignedFaculty)
    res.json({ unassignedFaculty });
  } catch (error) {
    // Handle errors
    console.error('Error fetching unassigned faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//assign role to faculty
app.post('/assign-role', async (req, res) => {
  try {
    const assignments = req.body; // Array of objects containing ID and role pairs
    // Loop through each assignment
    for (const { id, role } of assignments) {
      // Find the faculty member by ID
      const facultyMember = await Faculty.findById(id);
      facultyMember.role=role;
      if (!facultyMember) {
        console.log(`Faculty member with ID ${id} not found`);
        continue; // Move to the next assignment
      }

      // Convert role to lowercase
      const lowercaseRole = role;

      // Check the role and perform corresponding actions
      switch (lowercaseRole) {
        case 'Supervisor':
          // Create a new entry in the FYPSupervisor collection
          const supervisor = new Supervisor({
            supervisorId: id,
            maxFYPs: 0
          });
          await supervisor.save();
          break;
        case 'Panel':
          // Find a panel with less than 5 members
          let panel = await Panel.findOne({ $expr: { $lt: [{ $size: "$members" }, 5] } });

          if (!panel) {
            // If no panel with less than 5 members is found, create a new panel
            panel = new Panel({
              members: [id]
            });
          } else {
            // Add the faculty member's ID to the panel
            panel.members.push(id);
          }

          // Save the updated or new panel
          await panel.save();
          break;
        default:
          console.log(`Invalid role '${role}' specified for faculty member with ID ${id}`);
          continue; // Move to the next assignment
      }

      // Update the faculty member's role
      facultyMember.role = lowercaseRole;
      await facultyMember.save();

      console.log(`Role '${lowercaseRole}' assigned to faculty member with ID ${id} successfully`);
    }

    // Send success response
    res.json({ message: 'Roles assigned to faculty members successfully' });
  } catch (error) {
    console.error('Error assigning roles to faculty members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to get all panels
app.get('/panels', async (req, res) => {
  try {
    // Find all panels
    const panels = await Panel.find();
    
    // Return the panels as a JSON response
    res.json({ panels });
  } catch (error) {
    console.error('Error fetching panels:', error);
    // If an error occurs, send an error response
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api to assign panel to project with proj id and panel id as input
app.post('/assign-panel-to-project', async (req, res) => {
  try {
      // Extract panel ID and project ID from the request body
      const { panelId, projectId } = req.body;

      // Find the project by ID and update its panel ID
      const project = await Project.findByIdAndUpdate(projectId, { panel: panelId });

      // Check if the project exists
      if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Return success response
      res.json({ success: true, message: 'Panel assigned to project' });
  } catch (error) {
      console.error('Error assigning panel to project:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
//projects without panels
app.get('/unassigned-projects-panels', async (req, res) => {
  try {
      // Find projects where the panel field is null or undefined
      const unassignedProjects = await Project.find({ panel: { $exists: false } });

      // Return the list of unassigned projects to the frontend
      res.json({ unassignedProjects });
  } catch (error) {
      console.error('Error fetching unassigned projects:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
//get all students without a project
app.get('/students-without-project', async (req, res) => {
  try {
    // Find all students where project title is not assigned and they have team members
    const studentsWithoutProject = await Student.find({ 
      projectTitle: { $exists: false }, 
      groupMembers: { $exists: true, $not: { $size: 0 } } 
    });

    // Return the list of students without project title and with team members to the frontend
    res.json({ studentsWithoutProject });
  } catch (error) {
    console.error('Error fetching students without project title:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// get all projects that are not assigned to any student
app.get('/unassigned-projects-projects', async (req, res) => {
  try {
    // Fetch all projects
    const allProjects = await Project.find({}, '_id');

    // Extract project IDs
    const projectIds = allProjects.map(project => project._id);

    // Find all students
    const allStudents = await Student.find({}, 'projectTitle');
    
    // Extract project IDs from students' project titles
    const assignedProjectIds = allStudents.map(student => student.projectTitle);
    //console.log(assignedProjectIds)
    // Filter out project IDs that are assigned to students
    const customFilter = (projectIds, assignedProjectIds) => {
      // Create an empty array to store unassigned project IDs
      const unassignedProjectIds = [];
    
      // Iterate over each project ID in projectIds array
      for (const projectId of projectIds) {
        // Convert projectId to string for comparison
        const projectIdStr = projectId.toString();
    
        // Check if projectIdStr is not included in assignedProjectIds array
        if (!toString(assignedProjectIds).includes(projectIdStr)) {
          // If projectIdStr is not in assignedProjectIds, add it to unassignedProjectIds array
          unassignedProjectIds.push(projectIdStr);
        }
      }
    
      // Return the array of unassigned project IDs
      return unassignedProjectIds;
    };
    
    // Example usage:
    //const projectIds = ['project1', 'project2', 'project3'];
    //const assignedProjectIds = ['project1', 'project3'];
    
    const unassignedProjectIds = customFilter(projectIds, assignedProjectIds);
    // Query projects based on unassigned project IDs
    const unassignedProjects = await Project.find({ _id: { $in: unassignedProjectIds } });
    //new ObjectId('6634f806be569470ea6aad8a')
    //new ObjectId('6634f806be569470ea6aad8a')
    // Return the list of unassigned projects to the frontend
    res.json({ unassignedProjects });
  } catch (error) {
    console.error('Error fetching unassigned projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to assign project to student and his group members
app.post('/assign-project-to-students', async (req, res) => {
  try {
    // Extract student ID and project ID from the request body
    const { studentId, projectId } = req.body;

    // Find the student by ID and update its project ID
    const student = await Student.findByIdAndUpdate(studentId, { projectTitle: projectId });

    // Check if the student exists
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Assign project to group members
    const groupMembers = await Student.find({ groupMembers: studentId });
    for (const member of groupMembers) {
      await Student.findByIdAndUpdate(member._id, { projectTitle: projectId });
    }

    // Return success response
    res.json({ success: true, message: 'Project assigned to student and group members' });
  } catch (error) {
    console.error('Error assigning project to students:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
//projects without deadlines
app.get('/projects-without-deadline', async (req, res) => {
  try {
    // Find all projects where deadline is not assigned
    const projectsWithoutDeadline = await Project.find({ deadlines: { $exists: false } });

    // Return the list of projects without deadline to the frontend
    res.json({ projectsWithoutDeadline });
  } catch (error) {
    console.error('Error fetching projects without deadline:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//assign deadline to project
app.post('/assign-deadline-to-projects', async (req, res) => {
  try {
    const { deadlineDate, projectIds } = req.body;

    // Update each project with the specified deadline
    const promises = projectIds.map(async (projectId) => {
      await Project.findByIdAndUpdate(projectId, { deadlines: deadlineDate });
    });

    // Wait for all updates to complete
    await Promise.all(promises);

    // Return success message
    res.json({ message: 'Deadline assigned to projects successfully' });
  } catch (error) {
    console.error('Error assigning deadline to projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//get all projects
app.get('/projects', async (req, res) => {
  try {
    // Query all projects from the database
    const projects = await Project.find();

    // Return the projects as JSON response
    res.json({ projects });
  } catch (error) {
    // Handle errors
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//get project of a student
app.get('/projectDeadline', async (req, res) => {
  try {
    const id = req.query.id;

    // Find user by ID
    const user = await Student.findById(id);
    const projectid= user.projectTitle;
    const projectDetail = await Project.findById(projectid);
    // Check if user exists
    if (!projectDetail) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ projectDetail });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// projects details assigned to a supervisor
app.get('/projects-by-faculty', async (req, res) => {
  try {
    const id = req.query.id;
    // Find faculty by ID
    const faculty = await Faculty.findById(id);

    // Check if faculty exists
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Find supervisor with matching faculty ID
    const supervisor = await Supervisor.findOne({ supervisorId: id });
    console.log(supervisor)
    // Check if supervisor exists
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Find projects supervised by the faculty
    const projects = await Project.find({ supervisor: supervisor.supervisorId});

    // Return project titles and descriptions
    const projectsData = projects.map(project => ({
      title: project.title,
      description: project.description
    }));
    res.json({ projects: projectsData });
  } catch (error) {
    console.error('Error fetching projects by faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/projects-by-panel', async (req, res) => {
  try {
    const id = req.query.id;
    // Find faculty by ID
    const faculty = await Faculty.findById(id);

    // Check if faculty exists
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Find supervisor with matching faculty ID
    const panel = await Panel.findOne({ members: id });
    // Check if supervisor exists
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }

    // Find projects supervised by the faculty
    const projects = await Project.find({ panel: panel._id});

    // Return project titles and descriptions
    const projectsData = projects.map(project => ({
      title: project.title,
      description: project.description
    }));
    res.json({ projects: projectsData });
  } catch (error) {
    console.error('Error fetching projects by faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/ungraded-projects', async (req, res) => {
  try {
    const id = req.query.id;
    // Find faculty by ID
    const faculty = await Faculty.findById(id);

    // Check if faculty exists
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Find supervisor with matching faculty ID
    const supervisor = await Supervisor.findOne({ supervisorId: id });
    console.log(supervisor)
    // Check if supervisor exists
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Find projects supervised by the faculty
    const projects = await Project.find({ supervisor: supervisor.supervisorId , grade: null});

    // Return project titles and descriptions
    const projectsData = projects.map(project => ({
      id: project._id
    }));
    res.json({ projects: projectsData });
  } catch (error) {
    console.error('Error fetching projects by faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//assign grade
app.post('/assign-grade-to-project', async (req, res) => {
  try {
    const { projectId, grade } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Assign the grade to the project
    project.grade = grade;

    // Save the updated project to the database
    await project.save();

    res.json({ success: true, message: 'Grade assigned to project successfully' });
  } catch (error) {
    console.error('Error assigning grade to project:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// const dummyFacultyData = [
//   {
//     name: 'Anna Thompson',
//     email: 'annathompson@example.com',
//     password: 'anna2024',
//   },
//   {
//     name: 'James Taylor',
//     email: 'jamestaylor@example.com',
//     password: 'james1234',
//   },
//   {
//     name: 'Patricia Williams',
//     email: 'patriciawilliams@example.com',
//     password: 'patricia5678',
//   },
//   {
//     name: 'Mark Moore',
//     email: 'markmoore@example.com',
//     password: 'mark999',
//   },
//   {
//     name: 'Elizabeth Harris',
//     email: 'elizabethharris@example.com',
//     password: 'elizabeth777',
//   },
//   {
//     name: 'David Lewis',
//     email: 'davidlewis@example.com',
//     password: 'david4321',
//   },
//   {
//     name: 'Angela Clark',
//     email: 'angelaclark@example.com',
//     password: 'angela8282',
//   },
//   {
//     name: 'Christopher Walker',
//     email: 'christopherwalker@example.com',
//     password: 'chris2929',
//   },
//   {
//     name: 'Sophia Allen',
//     email: 'sophiaallen@example.com',
//     password: 'sophia6565',
//   },
//   {
//     name: 'Kevin Young',
//     email: 'kevinyoung@example.com',
//     password: 'kevin1111',
//   }
// ];



// // Function to add dummy data to Faculty model
// const addDummyFacultyData = async () => {
//   try {
//     // Hash passwords for dummy data
//     const hashedDummyData = await Promise.all(dummyFacultyData.map(async (data) => {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(data.password, salt);
//       return {
//         ...data,
//         password: hashedPassword,
//       };
//     }));

//     // Add hashed dummy data to Faculty model
//     await Faculty.insertMany(hashedDummyData);

//     console.log('Dummy faculty data added successfully');
//   } catch (error) {
//     console.error('Error adding dummy faculty data:', error);
//   } 
// };

// //Call the function to add dummy data
// addDummyFacultyData();
app.listen(3001, () => {
  console.log('Server running on port 3001');
});


