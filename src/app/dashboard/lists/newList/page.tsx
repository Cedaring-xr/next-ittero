import React from 'react'

function page() {
	return (
		<>
			<div>New list creation</div>
			<div>
				<h3>Template for list creation</h3>
				<form action="submit">
					<label htmlFor="#listName">List Name</label>
					<input type="text" id="listName" />
					<label htmlFor="#listCategory">List Category</label>
					<select id="listCategory" name="listCategory">
						<option value="test">placeholder option 1</option>
						<option value="test2">placeholder option 2</option>
						<option value="test3">placeholder option 3</option>
					</select>
					<button>Create New Category</button>
					<p>toggle for input field of new category</p>
					<button>Cancel</button>
				</form>
			</div>
		</>
	)
}

export default page
