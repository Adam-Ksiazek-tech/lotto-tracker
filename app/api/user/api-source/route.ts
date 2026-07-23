import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { isValidApiSource, DEFAULT_API_SOURCE } from "@/lib/constants/api-sources";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        { error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { apiSource } = body;

    if (!isValidApiSource(apiSource)) {
      return Response.json(
        { error: "Nieprawidłowe źródło API" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO user_settings (email, api_source)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET api_source = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING api_source`,
      [session.user.email, apiSource]
    );

    return Response.json({ 
      success: true, 
      apiSource: result.rows[0].api_source 
    });
  } catch (error) {
    console.error("Error saving API source:", error);
    return Response.json(
      { error: "Błąd serwera" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        { error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      "SELECT api_source FROM user_settings WHERE email = $1",
      [session.user.email]
    );

    const apiSource = result.rows[0]?.api_source || DEFAULT_API_SOURCE;

    return Response.json({ apiSource });
  } catch (error) {
    console.error("Error fetching API source:", error);
    return Response.json(
      { error: "Błąd serwera" },
      { status: 500 }
    );
  }
}