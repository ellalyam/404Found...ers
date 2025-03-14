## Repository Structure

This monorepo contains two modules for the frontend and backend of Tune/In.

### Frontend

This module is located in packages/frontend/ and is named "frontend".
- [`Module root`](../packages/frontend/): `index.html`, `vite.config.ts`, and `staticwebapp.config.json`
- [`src/`](../packages/frontend/src/): `main.tsx` and `vite-env.d.ts`.
- [`src/components/`](../packages/frontend/src/components/): the components of our homepage.
- [`src/pages/`](../packages/frontend/src/pages/): the pages of our website.
- [`src/services/`](../packages/frontend/src/services/): the functions that gather and manage data, as well as interact with APIs.
- [`src/styling/`](../packages/frontend/src/styling/): style sheets for the website and its components.
- [`public/images/`](../packages/frontend/public/images/): icons and default images.

### Backend

This module is located in packages/backend/ and is named "backend".
- [`Module root`](../packages/backend/): `backend.js`.
- [`services/`](../packages/backend/services/): the functions that gather and manage data, as well as interact with APIs.
- [`models/`](../packages/backend/models/): database schemas and type definitions.
- [`jest-testing/`](../packages/backend/jest-testing/): tests for the backend.
