import exp from "constants";
import React from "react";

function Left() {
    return (
        <div>
            <h1>Left</h1>
            <div>
                <h2>Navigation</h2>
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Services</li>
                    <li>Contact</li>
                </ul>
            </div>
            <div>
                <h2>Tables</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>25</td>
                            <td>john.doe@example.com</td>
                        </tr>
                        <tr>
                            <td>Jane Smith</td>
                            <td>30</td>
                            <td>jane.smith@example.com</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Lists</h2>
                <ol>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ol>
            </div>
            <div>
                <h2>Buttons</h2>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
            </div>
        </div>
    );
}

export default Left;