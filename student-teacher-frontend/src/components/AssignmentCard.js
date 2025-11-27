export default function AssignmentCard({ assignment }) {
  return (
    <div style={{ border: '1px solid gray', padding: 10, margin: 5 }}>
      <h3>{assignment.title}</h3>
      <p>{assignment.description}</p>
      <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
    </div>
  );
}
