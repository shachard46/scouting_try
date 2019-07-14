package scouting;

public class DatabaseManager {
	private static final DatabaseManager instance = new DatabaseManager();
	private final GameScoutingRepository gameScoutingRepository = new GameScoutingRepository();
	private final GameScoutingPropsRepository gameScoutingPropsRepository = new GameScoutingPropsRepository();
	private final EventMatchRepository eventMatchRepository = new EventMatchRepository();

	private DatabaseManager() {

	}

	public static DatabaseManager get() {
		return instance;
	}

	public GameScoutingRepository getGameScoutingRepository() {
		return gameScoutingRepository;
	}

	public GameScoutingPropsRepository getGameScoutingPropsRepository() {
		return gameScoutingPropsRepository;
	}

	public EventMatchRepository getEventMatchRepository() { return eventMatchRepository; }
}
