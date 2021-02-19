package com.fehniix.acnh_turnips;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public final class FileIO {
	public static final List<String> getFileList(String dir) {
		final File fileInstance = new File(dir);
		
		if (!fileInstance.exists())
			return null;

		return Stream.of(fileInstance.listFiles())
			.filter(file -> !file.isDirectory())
			.map(File::getName)
			.collect(Collectors.toList());
	}
}