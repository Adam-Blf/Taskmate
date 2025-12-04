import Note from '../models/Note.js';
import { extractWikiLinks } from '../utils/wikiLinks.js';

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, blocks, tags } = req.body;
    const note = new Note({ title, blocks, tags });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single note by ID
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const { title, blocks, tags } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, blocks, tags },
      { new: true } // Return the updated document
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Resolves WikiLinks found in the provided text or blocks.
 * Returns a list of found links with their status (existing Note ID or null).
 */
export const resolveLinks = async (req, res) => {
  try {
    const { content, blocks } = req.body;
    let textToScan = content || '';

    // If blocks are provided, concatenate their text content
    if (blocks && Array.isArray(blocks)) {
      textToScan += blocks.map(b => b.content).join(' ');
    }

    const linkTitles = extractWikiLinks(textToScan);

    // De-duplicate titles
    const uniqueTitles = [...new Set(linkTitles)];

    if (uniqueTitles.length === 0) {
      return res.json([]);
    }

    // Find notes that match these titles
    const foundNotes = await Note.find({
      title: { $in: uniqueTitles }
    }).select('_id title');

    // Construct the response mapping
    const results = uniqueTitles.map(title => {
      const match = foundNotes.find(n => n.title.toLowerCase() === title.toLowerCase());
      return {
        title,
        exists: !!match,
        noteId: match ? match._id : null
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
